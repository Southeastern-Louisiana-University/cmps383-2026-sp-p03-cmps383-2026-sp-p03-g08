using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP26.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNameToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Settings",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "{}",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Settings",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "{}");
        }
    }
}
