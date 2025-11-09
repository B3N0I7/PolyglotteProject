using FluentValidation;
using Polyglotte.Application.DTOs.User;

namespace Polyglotte.Application.Validators.User
{
    public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .WithMessage("Le nom d'utilisateur est requis")
                .MaximumLength(100)
                .WithMessage("Le nom d'utilisateur ne peut pas dépasser 100 caractères");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("L'email est requis")
                .EmailAddress()
                .WithMessage("L'email doit être valide");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Le mot de passe est requis")
                .MinimumLength(6)
                .WithMessage("Le mot de passe doit contenir au moins 6 caractères")
                .MaximumLength(100)
                .WithMessage("Le mot de passe ne peut pas dépasser 100 caractères");
        }
    }
}