using System.ComponentModel.DataAnnotations;

namespace HastaDoktorAPI.Models
{
    public class Mesaj
    {
        public int Id { get; set; }
        
        [Required]
        public int HastaId { get; set; }
        
        [Required]
        public int DoktorId { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string Icerik { get; set; } = string.Empty;
        
        [Required]
        public bool HastaTarafindanGonderildi { get; set; }
        
        public DateTime GonderimTarihi { get; set; } = DateTime.UtcNow;
        
        public bool Okundu { get; set; } = false;
        
        // Navigation properties
        public virtual Hasta? Hasta { get; set; }
        public virtual Doktor? Doktor { get; set; }
    }
}
