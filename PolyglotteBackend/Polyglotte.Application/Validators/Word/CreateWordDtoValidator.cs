using FluentValidation;
using Polyglotte.Application.DTOs.Word;

namespace Polyglotte.Application.Validators.Word
{
    public class CreateWordDtoValidator : AbstractValidator<CreateWordDto>
    {
        public CreateWordDtoValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty();
            RuleFor(x => x.EnglishWord)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.FrenchWord)
                .NotEmpty()
                .MaximumLength(50);
        }
    }
}