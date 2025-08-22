using System.ComponentModel.DataAnnotations;

namespace HastaDoktorAPI.Models
{
    public class MesajDto
    {
        [Required]
        public int HastaId { get; set; }
        
        [Required]
        public int DoktorId { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string Icerik { get; set; } = string.Empty;
        
        [Required]
        public bool HastaTarafindanGonderildi { get; set; }
    }
}
