<?php

namespace App\Rules;

use App\SpanishValidation;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Nie implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $spanishValidations = new SpanishValidation();
        if (!$spanishValidations->isValidNie($value)) {
            $fail('The :attribute must be a valid NIE');
        }
    }
}
