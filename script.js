// --- CONFIGURATION ---
const SUPABASE_URL = 'https://ijadcwdubuyjjiypddmn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KL-lDRyhpERJAFsN5sxPhA_AhxZTN4s';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { createClient } = supabase; 

// --- SHARED AUTH LOGIC ---

// Check if user is logged in
async function checkSession(requireAuth = false) {
    const { data: { session } } = await supabase.auth.getSession();
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (session && isLoginPage) {
        window.location.href = 'portal.html'; // Redirect to portal if already logged in
    } else if (!session && requireAuth) {
        window.location.href = 'index.html';  // Kick out if not logged in
    } else {
        // Show the content (remove loading state)
        if (document.getElementById('loading')) document.getElementById('loading').style.display = 'none';
        if (document.getElementById('auth-container')) document.getElementById('auth-container').classList.remove('hidden');
        if (document.getElementById('app')) document.getElementById('app').classList.remove('hidden');
    }
    return session;
}

// --- INDEX.HTML LOGIC (LOGIN/SIGNUP) ---
if (document.getElementById('auth-form')) {
    checkSession(); // Run check on load

    const form = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-btn');
    const title = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleText = document.getElementById('toggle-text');
    
    let isSignUp = true; // Default state

    // Toggle between Login and Signup
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUp = !isSignUp;
        title.innerText = isSignUp ? "Join Station" : "Welcome Back";
        submitBtn.innerText = isSignUp ? "Sign Up" : "Log In";
        toggleText.innerText = isSignUp ? "Already have an account?" : "Don't have an account?";
        toggleBtn.innerText = isSignUp ? "Log In" : "Sign Up";
        document.getElementById('error-msg').classList.add('hidden');
        document.getElementById('success-msg').classList.add('hidden');
    });

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');
        const successMsg = document.getElementById('success-msg');
        
        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";
        errorMsg.classList.add('hidden');

        let result;
        if (isSignUp) {
            result = await supabase.auth.signUp({ email, password });
            if (!result.error) {
                successMsg.innerText = "Success! Check your email to confirm.";
                successMsg.classList.remove('hidden');
            }
        } else {
            result = await supabase.auth.signInWithPassword({ email, password });
            if (!result.error) {
                window.location.href = 'portal.html';
            }
        }

        if (result.error) {
            errorMsg.innerText = result.error.message;
            errorMsg.classList.remove('hidden');
        }
        
        submitBtn.disabled = false;
        submitBtn.innerText = isSignUp ? "Sign Up" : "Log In";
    });
}

// --- PORTAL.HTML LOGIC ---
async function loadPortalData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Show Email
    document.getElementById('user-email').innerText = user.email;

    // 2. Logout Handler
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    });

    // 3. Fetch Status from Database
    const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .single();

    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-dot');

    if (data) {
        statusText.innerText = data.status;
        if (data.status === 'Active') {
            statusDot.classList.remove('bg-gray-300');
            statusDot.classList.add('bg-green-500');
        } else {
            statusDot.classList.remove('bg-gray-300');
            statusDot.classList.add('bg-yellow-400');
        }
    } else {
        statusText.innerText = "Profile not found";
    }
}