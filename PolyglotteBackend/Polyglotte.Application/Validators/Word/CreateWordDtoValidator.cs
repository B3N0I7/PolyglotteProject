using FluentValidation;
using Polyglotte.Application.DTOs.Word;

namespace Polyglotte.Application.Validators.Word
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