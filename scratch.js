fetch("https://cdlrucvzrmfgrpgqdvdo.supabase.co/rest/v1/pipeline_runs", {
  method: "POST",
  headers: {
    "apikey": "sb_publishable_9h_mVQb9HIBfLltDkUDcWg_tLeIjKGe",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },
  body: JSON.stringify({
    run_id: "TEST1234",
    status: "success",
    duration: "100ms",
    records: 10,
    source: "Test Source"
  })
}).then(r => r.json()).then(console.log)
