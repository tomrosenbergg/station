
const SUPABASE_URL = 'https://ijadcwdubuyjjiypddmn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KL-lDRyhpERJAFsN5sxPhA_AhxZTN4s';
const supabase = lib.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById('login-form');
const dashboard = document.getElementById('dashboard');
const loginSection = document.getElementById('login-section');

// 1. Check if user is already logged in
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        showDashboard(user);
    }
}

// 2. Handle Magic Link Request
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { emailRedirectTo: window.location.href }
    });

    if (error) {
        document.getElementById('message').innerText = `ERROR: ${error.message}`;
    } else {
        document.getElementById('message').innerText = "LINK_SENT. CHECK YOUR INBOX.";
    }
});

// 3. UI Switch
function showDashboard(user) {
    loginSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('user-email').innerText = user.email;
}

async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
}

checkUser();