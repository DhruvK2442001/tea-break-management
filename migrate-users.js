// migrate-users.js
import { createClient } from "@supabase/supabase-js";

// Use the SERVICE ROLE key from your Supabase dashboard
const supabase = createClient(
  "https://uzhkebihwbncvtfnatjy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6aGtlYmlod2JuY3Z0Zm5hdGp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUyODgwOSwiZXhwIjoyMDc4MTA0ODA5fQ.7tWdlVBrLcDSvDXdl-hDLCEIdZyCaNvI35NopBvecdk" // ⚠️ NOT the anon key
);

async function migrateUsers() {
  const { data: users, error } = await supabase.from("users").select("*");
  console.log(users);
  if (error) throw error;

  for (const user of users) {
    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        role: "user",
      });

    if (authError) {
      console.error(`Failed for ${user.email}:`, authError.message);
      continue;
    }

    // Link the created auth_user_id back to your table
    await supabase
      .from("users")
      .update({ auth_user_id: authData.user.id })
      .eq("id", user.id);

    console.log(`✅ Migrated: ${user.email}`);
  }

  console.log("🎉 Migration complete!");
}

migrateUsers().catch(console.error);
