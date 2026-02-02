// --- CONFIGURATION ---
const SUPABASE_URL = 'https://ijadcwdubuyjjiypddmn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KL-lDRyhpERJAFsN5sxPhA_AhxZTN4s';


// 1. Check if the CDN library loaded
if (!window.supabase) {
    console.error('Supabase CDN not loaded. Check your HTML <script> tags.');
}

// 2. Initialize Client
// We name this 'sb' to prevent the "Redeclaration" error.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- SHARED AUTH LOGIC ---

async function checkSession(requireAuth = false) {
    const { data: { session } } = await sb.auth.getSession();
    
    // Logic to detect if we are on the landing page or portal page
    const path = window.location.pathname;
    const isLoginPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');

    if (session && isLoginPage) {
        window.location.href = 'portal.html'; 
    } else if (!session && requireAuth) {
        window.location.href = 'index.html';
    } else {
        // Safe to show content
        const loading = document.getElementById('loading');
        const authContainer = document.getElementById('auth-container');
        const app = document.getElementById('app');

        if (loading) loading.style.display = 'none';
        if (authContainer) authContainer.classList.remove('hidden');
        if (app) app.classList.remove('hidden');
    }
    return session;
}

// --- INDEX.HTML LOGIC (LOGIN/SIGNUP) ---
if (document.getElementById('auth-form')) {
    checkSession(); 

    const form = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-btn');
    const title = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleText = document.getElementById('toggle-text');
    
    let isSignUp = true; 

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
            result = await sb.auth.signUp({ email, password });
            if (!result.error) {
                successMsg.innerText = "Success! Check your email to confirm.";
                successMsg.classList.remove('hidden');
            }
        } else {
            result = await sb.auth.signInWithPassword({ email, password });
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
if (document.getElementById('app')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const session = await checkSession(true);
        if(session) loadPortalData();
    });
}

async function loadPortalData() {
    const { data: { user } } = await sb.auth.getUser();
    
    document.getElementById('user-email').innerText = user.email;

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await sb.auth.signOut();
        window.location.href = 'index.html';
    });

    const { data, error } = await sb
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