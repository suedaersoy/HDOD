using Microsoft.EntityFrameworkCore;
using HastaDoktorAPI.Models;

namespace HastaDoktorAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Doktor> Doktorlar { get; set; }
        public DbSet<Hasta> Hastalar { get; set; }
        public DbSet<Mesaj> Mesajlar { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Doktor entity configuration
            modelBuilder.Entity<Doktor>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Ad).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Soyad).IsRequired().HasMaxLength(100);
                entity.Property(e => e.UzmanlikAlani).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Telefon).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Aciklama).HasMaxLength(500);
            });

            // Hasta entity configuration
            modelBuilder.Entity<Hasta>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Ad).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Soyad).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Telefon).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Cinsiyet).HasMaxLength(10);
                entity.Property(e => e.Adres).HasMaxLength(500);
            });

            // Mesaj entity configuration
            modelBuilder.Entity<Mesaj>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Icerik).IsRequired().HasMaxLength(1000);
                
                // Foreign key relationships
                entity.HasOne(e => e.Hasta)
                    .WithMany(e => e.Mesajlar)
                    .HasForeignKey(e => e.HastaId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(e => e.Doktor)
                    .WithMany(e => e.Mesajlar)
                    .HasForeignKey(e => e.DoktorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Doktor seed data
            modelBuilder.Entity<Doktor>().HasData(
                new Doktor
                {
                    Id = 1,
                    Ad = "Dr. Ahmet",
                    Soyad = "Yılmaz",
                    UzmanlikAlani = "Kardiyoloji",
                    Email = "ahmet.yilmaz@hastane.com",
                    Telefon = "0555-111-1111",
                    Aciklama = "Kardiyoloji uzmanı, 15 yıl deneyim",
                    Aktif = true,
                    KayitTarihi = new DateTime(2024, 1, 1, 10, 0, 0, DateTimeKind.Utc)
                },
                new Doktor
                {
                    Id = 2,
                    Ad = "Dr. Ayşe",
                    Soyad = "Demir",
                    UzmanlikAlani = "Nöroloji",
                    Email = "ayse.demir@hastane.com",
                    Telefon = "0555-222-2222",
                    Aciklama = "Nöroloji uzmanı, baş ağrısı ve migren konusunda uzman",
                    Aktif = true,
                    KayitTarihi = new DateTime(2024, 1, 1, 11, 0, 0, DateTimeKind.Utc)
                },
                new Doktor
                {
                    Id = 3,
                    Ad = "Dr. Mehmet",
                    Soyad = "Kaya",
                    UzmanlikAlani = "Ortopedi",
                    Email = "mehmet.kaya@hastane.com",
                    Telefon = "0555-333-3333",
                    Aciklama = "Ortopedi uzmanı, spor yaralanmaları konusunda uzman",
                    Aktif = true,
                    KayitTarihi = new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc)
                }
            );

            // Hasta seed data
            modelBuilder.Entity<Hasta>().HasData(
                new Hasta
                {
                    Id = 1,
                    Ad = "Fatma",
                    Soyad = "Özkan",
                    Email = "fatma.ozkan@email.com",
                    Telefon = "0555-444-4444",
                    DogumTarihi = new DateTime(1985, 5, 15, 0, 0, 0, DateTimeKind.Utc),
                    Cinsiyet = "Kadın",
                    Adres = "İstanbul, Türkiye",
                    Aktif = true,
                    KayitTarihi = new DateTime(2024, 1, 1, 13, 0, 0, DateTimeKind.Utc)
                },
                new Hasta
                {
                    Id = 2,
                    Ad = "Ali",
                    Soyad = "Çelik",
                    Email = "ali.celik@email.com",
                    Telefon = "0555-555-5555",
                    DogumTarihi = new DateTime(1990, 8, 22, 0, 0, 0, DateTimeKind.Utc),
                    Cinsiyet = "Erkek",
                    Adres = "Ankara, Türkiye",
                    Aktif = true,
                    KayitTarihi = new DateTime(2024, 1, 1, 14, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
