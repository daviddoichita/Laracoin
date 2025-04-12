<?php

namespace App;

class SpanishValidation
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function isValidPersonalId(?string $value): bool
    {
        return
            $this->isValidNif($value) ||
            $this->isValidNie($value);
    }

    public function isValidNif(?string $value): bool
    {
        if ($value) {
            $regEx = '/^[0-9]{8}[A-Z]$/i';

            $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

            $value = strtoupper($value);

            if (preg_match($regEx, $value)) {
                return $letters[substr($value, 0, 8) % 23] == $value[8];
            }
        }

        return false;
    }

    public function isValidNie(?string $value): bool
    {
        if ($value) {
            $regEx = '/^[KLMXYZ][0-9]{7}[A-Z]$/i';
            $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

            $value = strtoupper($value);

            if (preg_match($regEx, $value)) {
                $replaced = str_replace(['X', 'Y', 'Z'], [0, 1, 2], $value);

                return $letters[substr($replaced, 0, 8) % 23] == $value[8];
            }
        }

        return false;
    }

    public function isValidPhone(?string $value): bool
    {
        if ($value) {
            $regEx = '/^[9|8|6|7][0-9]{8}$/i';

            return preg_match($regEx, $value) === 1;
        }

        return false;
    }
}
