using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP26.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMenuAndLocationToggles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEnabled",
                table: "MenuItems",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPopular",
                table: "MenuItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DriveThruEnabled",
                table: "Locations",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "OnlineOrderingEnabled",
                table: "Locations",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ReservationsEnabled",
                table: "Locations",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEnabled",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "IsPopular",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "DriveThruEnabled",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "OnlineOrderingEnabled",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "ReservationsEnabled",
                table: "Locations");
        }
    }
}
