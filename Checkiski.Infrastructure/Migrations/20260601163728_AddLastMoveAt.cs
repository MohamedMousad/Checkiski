using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Checkiski.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLastMoveAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastMoveAt",
                table: "Games",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastMoveAt",
                table: "Games");
        }
    }
}
