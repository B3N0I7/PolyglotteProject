using FluentValidation;
using Polyglotte.Application.DTOs;

namespace Polyglotte.Application.Validators
{
    public class CreateWordDtoValidator : AbstractValidator<CreateWordDto>
    {
        public CreateWordDtoValidator()
        {
            RuleFor(x => x.EnglishWord)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.FrenchWord)
                .NotEmpty()
                .MaximumLength(200);
        }
    }
}