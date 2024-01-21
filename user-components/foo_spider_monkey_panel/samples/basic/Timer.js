window.DefineScript('Timer', { author: 'T.P Wang' });

// This sample create two timers
// Click the window to start the timer, and see the result after the console is shown.
// Click the window again to kill all timers.

let g_timer_started = false;
let g_count = 0;
let g_timer1_ID = 0, g_timer2_ID = 0;

function print_to_console(msg) {
    console.log('Timer test:', msg);
}

function on_mouse_lbtn_up() {
    if (!g_timer_started) {
        // Timer are created here
        // 2s - one shot, happens after 2000 ms, only once
        g_timer1_ID = setTimeout(() => {
            // Print and show console
            fb.ShowConsole();
            print_to_console('g_timer1: Show console now.');
        }, 2000);

        // 500ms - periodic, happens every 500 ms
        g_timer2_ID = setInterval(() => {
            g_count++;
            print_to_console('g_timer2: ' + g_count + ' time(s).');
        }, 500);

        g_timer_started = true;
    }
    else {
        // Kill all timers
        clearTimeout(g_timer2_ID);
        clearInterval(g_timer1_ID);
        g_timer_started = false;
        g_count = 0;
        print_to_console('Timers killed.');
    }
}
