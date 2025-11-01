using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Polyglotte.Application.DTOs.Word;
using Polyglotte.Application.Interfaces;

namespace Polyglotte.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WordsController : ControllerBase
    {
        private readonly IWordService _service;
        private readonly IValidator<CreateWordDto> _createValidator;
        private readonly IValidator<UpdateWordDto> _updateValidator;

        public WordsController(
            IWordService service,
            IValidator<CreateWordDto> createValidator,
            IValidator<UpdateWordDto> updateValidator)
        {
            _service = service;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _service.GetAllAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<IActionResult> GetById(string id, CancellationToken cancellationToken)
        {
            var word = await _service.GetByIdAsync(id, cancellationToken);
            if (word is null) return NotFound();
            return Ok(word);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateWordDto dto, CancellationToken cancellationToken)
        {
            ValidationResult validation = await _createValidator.ValidateAsync(dto, cancellationToken);
            if (!validation.IsValid) return BadRequest(validation.ToDictionary());

            var created = await _service.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateWordDto dto, CancellationToken cancellationToken)
        {
            ValidationResult validation = await _updateValidator.ValidateAsync(dto, cancellationToken);
            if (!validation.IsValid) return BadRequest(validation.ToDictionary());

            var success = await _service.UpdateAsync(id, dto, cancellationToken);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
        {
            var success = await _service.DeleteAsync(id, cancellationToken);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}