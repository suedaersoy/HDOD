using System.ComponentModel.DataAnnotations;

namespace HastaDoktorAPI.Models
{
    public class Hasta
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Ad { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Soyad { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Telefon { get; set; } = string.Empty;
        
        public DateTime DogumTarihi { get; set; }
        
        [StringLength(10)]
        public string? Cinsiyet { get; set; }
        
        [StringLength(500)]
        public string? Adres { get; set; }
        
        public bool Aktif { get; set; } = true;
        
        public DateTime KayitTarihi { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<Mesaj> Mesajlar { get; set; } = new List<Mesaj>();
    }
}
