using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HastaDoktorAPI.Data;
using HastaDoktorAPI.Models;

namespace HastaDoktorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MesajlarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MesajlarController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Mesajlar
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mesaj>>> GetMesajlar()
        {
            return await _context.Mesajlar
                .Include(m => m.Hasta)
                .Include(m => m.Doktor)
                .OrderByDescending(m => m.GonderimTarihi)
                .ToListAsync();
        }

        // GET: api/Mesajlar/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mesaj>> GetMesaj(int id)
        {
            var mesaj = await _context.Mesajlar
                .Include(m => m.Hasta)
                .Include(m => m.Doktor)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (mesaj == null)
            {
                return NotFound();
            }

            return mesaj;
        }

        // GET: api/Mesajlar/hasta/5
        [HttpGet("hasta/{hastaId}")]
        public async Task<ActionResult<IEnumerable<Mesaj>>> GetMesajlarByHasta(int hastaId)
        {
            return await _context.Mesajlar
                .Include(m => m.Hasta)
                .Include(m => m.Doktor)
                .Where(m => m.HastaId == hastaId)
                .OrderBy(m => m.GonderimTarihi)
                .ToListAsync();
        }

        // GET: api/Mesajlar/doktor/5
        [HttpGet("doktor/{doktorId}")]
        public async Task<ActionResult<IEnumerable<Mesaj>>> GetMesajlarByDoktor(int doktorId)
        {
            return await _context.Mesajlar
                .Include(m => m.Hasta)
                .Include(m => m.Doktor)
                .Where(m => m.DoktorId == doktorId)
                .OrderBy(m => m.GonderimTarihi)
                .ToListAsync();
        }

        // GET: api/Mesajlar/konusma/5/3
        [HttpGet("konusma/{hastaId}/{doktorId}")]
        public async Task<ActionResult<IEnumerable<Mesaj>>> GetKonusma(int hastaId, int doktorId)
        {
            return await _context.Mesajlar
                .Include(m => m.Hasta)
                .Include(m => m.Doktor)
                .Where(m => m.HastaId == hastaId && m.DoktorId == doktorId)
                .OrderBy(m => m.GonderimTarihi)
                .ToListAsync();
        }

        // POST: api/Mesajlar
        [HttpPost]
        public async Task<ActionResult<Mesaj>> PostMesaj(MesajDto mesajDto)
        {
            // Hasta ve doktor kontrolü
            var hasta = await _context.Hastalar.FindAsync(mesajDto.HastaId);
            var doktor = await _context.Doktorlar.FindAsync(mesajDto.DoktorId);

            if (hasta == null || doktor == null)
            {
                return BadRequest("Hasta veya doktor bulunamadı.");
            }

            var mesaj = new Mesaj
            {
                HastaId = mesajDto.HastaId,
                DoktorId = mesajDto.DoktorId,
                Icerik = mesajDto.Icerik,
                HastaTarafindanGonderildi = mesajDto.HastaTarafindanGonderildi,
                GonderimTarihi = DateTime.UtcNow,
                Okundu = false
            };

            _context.Mesajlar.Add(mesaj);
            await _context.SaveChangesAsync();

            // Mesajı include ederek döndür
            await _context.Entry(mesaj)
                .Reference(m => m.Hasta)
                .LoadAsync();
            await _context.Entry(mesaj)
                .Reference(m => m.Doktor)
                .LoadAsync();

            return CreatedAtAction(nameof(GetMesaj), new { id = mesaj.Id }, mesaj);
        }

        // PUT: api/Mesajlar/5/okundu
        [HttpPut("{id}/okundu")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var mesaj = await _context.Mesajlar.FindAsync(id);
            if (mesaj == null)
            {
                return NotFound();
            }

            mesaj.Okundu = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Mesajlar/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMesaj(int id, Mesaj mesaj)
        {
            if (id != mesaj.Id)
            {
                return BadRequest();
            }

            var existingMesaj = await _context.Mesajlar.FindAsync(id);
            if (existingMesaj == null)
            {
                return NotFound();
            }

            existingMesaj.Icerik = mesaj.Icerik;
            existingMesaj.Okundu = mesaj.Okundu;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MesajExists(id))
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

        // DELETE: api/Mesajlar/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMesaj(int id)
        {
            var mesaj = await _context.Mesajlar.FindAsync(id);
            if (mesaj == null)
            {
                return NotFound();
            }

            _context.Mesajlar.Remove(mesaj);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MesajExists(int id)
        {
            return _context.Mesajlar.Any(e => e.Id == id);
        }
    }
}
