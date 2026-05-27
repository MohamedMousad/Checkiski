using Checkiski.Domain.Entities;
using Microsoft.EntityFrameworkCore;

using Checkiski.Application.Common.Interfaces;

namespace Checkiski.Infrastructure.Data
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public DbSet<Game> Games { get; set; } = null!;
        public DbSet<Player> Players { get; set; } = null!;
        public DbSet<Puzzle> Puzzles { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Player
            modelBuilder.Entity<Player>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Username).IsUnique();
            });

            // Configure Game
            modelBuilder.Entity<Game>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(g => g.WhitePlayer)
                      .WithMany(p => p.GamesAsWhite)
                      .HasForeignKey(g => g.WhitePlayerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(g => g.BlackPlayer)
                      .WithMany(p => p.GamesAsBlack)
                      .HasForeignKey(g => g.BlackPlayerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.MoveList)
                      .HasConversion(
                          v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                          v => System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new System.Collections.Generic.List<string>()
                      );
                entity.Property(e => e.CurrentTurn)
                      .HasConversion<string>();

                entity.OwnsOne(g => g.Options, options =>
                {
                    options.Property(o => o.ColorChoice).HasColumnName("Options_ColorChoice");
                    options.Property(o => o.Rated).HasColumnName("Options_Rated");
                    options.Property(o => o.GameCategory).HasColumnName("Options_GameCategory");
                    options.OwnsOne(o => o.TimeControl, timeControl =>
                    {
                        timeControl.Property(tc => tc.BaseMinutes).HasColumnName("Options_TimeControl_BaseMinutes");
                        timeControl.Property(tc => tc.IncrementSeconds).HasColumnName("Options_TimeControl_IncrementSeconds");
                    });
                });
            });
        }
    }
}
