using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Checkiski.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PhaseB_PhaseC_Updates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    BulletRating = table.Column<int>(type: "integer", nullable: false),
                    BlitzRating = table.Column<int>(type: "integer", nullable: false),
                    RapidRating = table.Column<int>(type: "integer", nullable: false),
                    ClassicalRating = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WhitePlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    BlackPlayerId = table.Column<Guid>(type: "uuid", nullable: true),
                    Pgn = table.Column<string>(type: "text", nullable: false),
                    CurrentFen = table.Column<string>(type: "text", nullable: false),
                    Options_ColorChoice = table.Column<int>(type: "integer", nullable: false),
                    Options_Rated = table.Column<bool>(type: "boolean", nullable: false),
                    Options_TimeControl_BaseMinutes = table.Column<int>(type: "integer", nullable: false),
                    Options_TimeControl_IncrementSeconds = table.Column<int>(type: "integer", nullable: false),
                    Options_GameCategory = table.Column<int>(type: "integer", nullable: false),
                    WhiteClockRemaining = table.Column<TimeSpan>(type: "interval", nullable: false),
                    BlackClockRemaining = table.Column<TimeSpan>(type: "interval", nullable: false),
                    CurrentTurn = table.Column<int>(type: "integer", nullable: false),
                    MoveList = table.Column<List<string>>(type: "text[]", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Games_Players_BlackPlayerId",
                        column: x => x.BlackPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Games_Players_WhitePlayerId",
                        column: x => x.WhitePlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_BlackPlayerId",
                table: "Games",
                column: "BlackPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Games_WhitePlayerId",
                table: "Games",
                column: "WhitePlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Players_Username",
                table: "Players",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Players");
        }
    }
}
