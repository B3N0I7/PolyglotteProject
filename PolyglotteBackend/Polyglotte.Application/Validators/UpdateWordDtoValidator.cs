using FluentValidation;
using Polyglotte.Application.DTOs;

namespace Polyglotte.Application.Validators
{
    public class UpdateWordDtoValidator : AbstractValidator<UpdateWordDto>
    {
        public UpdateWordDtoValidator()
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