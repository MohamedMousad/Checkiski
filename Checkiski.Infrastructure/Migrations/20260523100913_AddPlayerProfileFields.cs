using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Checkiski.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPlayerProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "Players",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Players",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "Players",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "Players");
        }
    }
}
