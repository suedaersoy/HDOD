using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HastaDoktorAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Doktorlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Soyad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UzmanlikAlani = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Aciklama = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Aktif = table.Column<bool>(type: "boolean", nullable: false),
                    KayitTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doktorlar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Hastalar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Soyad = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    DogumTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Cinsiyet = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Adres = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Aktif = table.Column<bool>(type: "boolean", nullable: false),
                    KayitTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hastalar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Mesajlar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HastaId = table.Column<int>(type: "integer", nullable: false),
                    DoktorId = table.Column<int>(type: "integer", nullable: false),
                    Icerik = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    HastaTarafindanGonderildi = table.Column<bool>(type: "boolean", nullable: false),
                    GonderimTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Okundu = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mesajlar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mesajlar_Doktorlar_DoktorId",
                        column: x => x.DoktorId,
                        principalTable: "Doktorlar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Mesajlar_Hastalar_HastaId",
                        column: x => x.HastaId,
                        principalTable: "Hastalar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Doktorlar",
                columns: new[] { "Id", "Aciklama", "Ad", "Aktif", "Email", "KayitTarihi", "Soyad", "Telefon", "UzmanlikAlani" },
                values: new object[,]
                {
                    { 1, "Kardiyoloji uzmanı, 15 yıl deneyim", "Dr. Ahmet", true, "ahmet.yilmaz@hastane.com", new DateTime(2024, 1, 1, 10, 0, 0, 0, DateTimeKind.Utc), "Yılmaz", "0555-111-1111", "Kardiyoloji" },
                    { 2, "Nöroloji uzmanı, baş ağrısı ve migren konusunda uzman", "Dr. Ayşe", true, "ayse.demir@hastane.com", new DateTime(2024, 1, 1, 11, 0, 0, 0, DateTimeKind.Utc), "Demir", "0555-222-2222", "Nöroloji" },
                    { 3, "Ortopedi uzmanı, spor yaralanmaları konusunda uzman", "Dr. Mehmet", true, "mehmet.kaya@hastane.com", new DateTime(2024, 1, 1, 12, 0, 0, 0, DateTimeKind.Utc), "Kaya", "0555-333-3333", "Ortopedi" }
                });

            migrationBuilder.InsertData(
                table: "Hastalar",
                columns: new[] { "Id", "Ad", "Adres", "Aktif", "Cinsiyet", "DogumTarihi", "Email", "KayitTarihi", "Soyad", "Telefon" },
                values: new object[,]
                {
                    { 1, "Fatma", "İstanbul, Türkiye", true, "Kadın", new DateTime(1985, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), "fatma.ozkan@email.com", new DateTime(2024, 1, 1, 13, 0, 0, 0, DateTimeKind.Utc), "Özkan", "0555-444-4444" },
                    { 2, "Ali", "Ankara, Türkiye", true, "Erkek", new DateTime(1990, 8, 22, 0, 0, 0, 0, DateTimeKind.Utc), "ali.celik@email.com", new DateTime(2024, 1, 1, 14, 0, 0, 0, DateTimeKind.Utc), "Çelik", "0555-555-5555" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Doktorlar_Email",
                table: "Doktorlar",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Mesajlar_DoktorId",
                table: "Mesajlar",
                column: "DoktorId");

            migrationBuilder.CreateIndex(
                name: "IX_Mesajlar_HastaId",
                table: "Mesajlar",
                column: "HastaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Mesajlar");

            migrationBuilder.DropTable(
                name: "Doktorlar");

            migrationBuilder.DropTable(
                name: "Hastalar");
        }
    }
}
