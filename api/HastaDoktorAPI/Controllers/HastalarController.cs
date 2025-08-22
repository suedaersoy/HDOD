using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HastaDoktorAPI.Data;
using HastaDoktorAPI.Models;

namespace HastaDoktorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HastalarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HastalarController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Hastalar
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hasta>>> GetHastalar()
        {
            return await _context.Hastalar
                .Where(h => h.Aktif)
                .OrderBy(h => h.Ad)
                .ToListAsync();
        }

        // GET: api/Hastalar/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Hasta>> GetHasta(int id)
        {
            var hasta = await _context.Hastalar
                .FirstOrDefaultAsync(h => h.Id == id && h.Aktif);

            if (hasta == null)
            {
                return NotFound();
            }

            return hasta;
        }

        // POST: api/Hastalar
        [HttpPost]
        public async Task<ActionResult<Hasta>> PostHasta(Hasta hasta)
        {
            if (await _context.Hastalar.AnyAsync(h => h.Email == hasta.Email))
            {
                return BadRequest("Bu email adresi zaten kullanılıyor.");
            }

            hasta.KayitTarihi = DateTime.UtcNow;
            hasta.Aktif = true;
            
            // DogumTarihi'ni UTC'ye çevir
            if (hasta.DogumTarihi.Kind == DateTimeKind.Unspecified)
            {
                hasta.DogumTarihi = DateTime.SpecifyKind(hasta.DogumTarihi, DateTimeKind.Utc);
            }

            _context.Hastalar.Add(hasta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHasta), new { id = hasta.Id }, hasta);
        }

        // PUT: api/Hastalar/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHasta(int id, Hasta hasta)
        {
            if (id != hasta.Id)
            {
                return BadRequest();
            }

            var existingHasta = await _context.Hastalar.FindAsync(id);
            if (existingHasta == null)
            {
                return NotFound();
            }

            // Email kontrolü (kendi email'i hariç)
            if (await _context.Hastalar.AnyAsync(h => h.Email == hasta.Email && h.Id != id))
            {
                return BadRequest("Bu email adresi zaten kullanılıyor.");
            }

            existingHasta.Ad = hasta.Ad;
            existingHasta.Soyad = hasta.Soyad;
            existingHasta.Email = hasta.Email;
            existingHasta.Telefon = hasta.Telefon;
            // DogumTarihi'ni UTC'ye çevir
            if (hasta.DogumTarihi.Kind == DateTimeKind.Unspecified)
            {
                existingHasta.DogumTarihi = DateTime.SpecifyKind(hasta.DogumTarihi, DateTimeKind.Utc);
            }
            else
            {
                existingHasta.DogumTarihi = hasta.DogumTarihi;
            }
            existingHasta.Cinsiyet = hasta.Cinsiyet;
            existingHasta.Adres = hasta.Adres;
            existingHasta.Aktif = hasta.Aktif;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HastaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Hastalar/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHasta(int id)
        {
            var hasta = await _context.Hastalar.FindAsync(id);
            if (hasta == null)
            {
                return NotFound();
            }

            hasta.Aktif = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HastaExists(int id)
        {
            return _context.Hastalar.Any(e => e.Id == id);
        }
    }
}
