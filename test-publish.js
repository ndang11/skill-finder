import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error("Missing Supabase URL or Key");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPublish() {
	const email = `test-${Date.now()}@example.com`;
	const password = "password123";

	console.log(`Creating user: ${email}...`);
	const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				fullname: "Test Professional",
				role: "professional",
				serviceCategory: "Plumbing",
			},
		},
	});

	if (signUpError) {
		console.error("Sign up error:", signUpError);
		process.exit(1);
	}

	const token = signUpData.session?.access_token;
	const userId = signUpData.user?.id;

	if (!token) {
		console.error("No session token returned. Is email confirmation disabled?");
		process.exit(1);
	}

	console.log("User created successfully. ID:", userId);

	// Sync user
	console.log("Syncing user to backend...");
	const syncRes = await fetch("http://localhost:3001/users/sync", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			id: userId,
			fullname: "Test Professional",
			email: email,
		}),
	});

	if (!syncRes.ok) {
		console.error("Sync failed:", await syncRes.text());
		process.exit(1);
	}
	console.log("User synced.");

	// Create Post
	console.log("Creating post...");
	const postRes = await fetch("http://localhost:3001/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			title: "My First Plumbing Job",
			content: "Fixed a leak today!",
			authorCategory: "Plumbing",
			postType: "showcase",
			tags: ["plumbing", "leak"],
		}),
	});

	if (!postRes.ok) {
		console.error("Create post failed:", await postRes.text());
		process.exit(1);
	}

	const postData = await postRes.json();
	console.log("Post created successfully!", postData);

	// Fetch feed
	console.log("Fetching feed to see if it appears...");
	const feedRes = await fetch("http://localhost:3001/posts", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const feedData = await feedRes.json();
	const found = feedData.some((p) => p.id === postData.id);
	console.log("Does post appear in feed?", found);
}

testPublish().catch(console.error);
