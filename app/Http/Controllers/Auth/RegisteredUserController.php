<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use App\Models\Crypto;
use App\Models\User;
use App\Models\UserBalance;
use App\Rules\SpanishId;
use App\Rules\SpanishPhone;
use DB;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Mail;
use Str;

use function Illuminate\Log\log;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'surnames' => 'required|string|max:255',
            'nif' => ['required', 'string', new SpanishId],
            'phoneNumber' => ['required', new SpanishPhone],
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'surnames' => $request->surnames,
            'nif' => $request->nif,
            'phone_number' => $request->phoneNumber,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        UserBalance::create([
            'uuid' => Str::uuid(),
            'user_id' => $user->id,
            'crypto_id' => Crypto::where('symbol', '=', 'EUR')->get()[0]->id,
            'balance' => 1000
        ]);

        $cryptos = Crypto::all()->where('symbol', '!=', 'EUR');

        $balances = [];
        foreach ($cryptos as $crypto) {
            array_push($balances, [
                'uuid' => Str::uuid(),
                'user_id' => $user->id,
                'crypto_id' => $crypto->id,
                'balance' => 0,
            ]);
        }

        DB::table('user_balances')->insert($balances);

        if ($user->email == "daviddoichita@proton.me") {
            Mail::to($user->email)->send(new WelcomeMail($user));
        }

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
