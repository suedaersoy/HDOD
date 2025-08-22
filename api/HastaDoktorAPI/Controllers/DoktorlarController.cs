using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HastaDoktorAPI.Data;
using HastaDoktorAPI.Models;

namespace HastaDoktorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoktorlarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoktorlarController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Doktorlar
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doktor>>> GetDoktorlar()
        {
            return await _context.Doktorlar
                .Where(d => d.Aktif)
                .OrderBy(d => d.Ad)
                .ToListAsync();
        }

        // GET: api/Doktorlar/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doktor>> GetDoktor(int id)
        {
            var doktor = await _context.Doktorlar
                .FirstOrDefaultAsync(d => d.Id == id && d.Aktif);

            if (doktor == null)
            {
                return NotFound();
            }

            return doktor;
        }

        // POST: api/Doktorlar
        [HttpPost]
        public async Task<ActionResult<Doktor>> PostDoktor(Doktor doktor)
        {
            if (await _context.Doktorlar.AnyAsync(d => d.Email == doktor.Email))
            {
                return BadRequest("Bu email adresi zaten kullanılıyor.");
            }

            doktor.KayitTarihi = DateTime.UtcNow;
            doktor.Aktif = true;

            _context.Doktorlar.Add(doktor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDoktor), new { id = doktor.Id }, doktor);
        }

        // PUT: api/Doktorlar/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoktor(int id, Doktor doktor)
        {
            if (id != doktor.Id)
            {
                return BadRequest();
            }

            var existingDoktor = await _context.Doktorlar.FindAsync(id);
            if (existingDoktor == null)
            {
                return NotFound();
            }

            // Email kontrolü (kendi email'i hariç)
            if (await _context.Doktorlar.AnyAsync(d => d.Email == doktor.Email && d.Id != id))
            {
                return BadRequest("Bu email adresi zaten kullanılıyor.");
            }

            existingDoktor.Ad = doktor.Ad;
            existingDoktor.Soyad = doktor.Soyad;
            existingDoktor.UzmanlikAlani = doktor.UzmanlikAlani;
            existingDoktor.Email = doktor.Email;
            existingDoktor.Telefon = doktor.Telefon;
            existingDoktor.Aciklama = doktor.Aciklama;
            existingDoktor.Aktif = doktor.Aktif;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoktorExists(id))
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

        // DELETE: api/Doktorlar/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoktor(int id)
        {
            var doktor = await _context.Doktorlar.FindAsync(id);
            if (doktor == null)
            {
                return NotFound();
            }

            doktor.Aktif = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DoktorExists(int id)
        {
            return _context.Doktorlar.Any(e => e.Id == id);
        }
    }
}
