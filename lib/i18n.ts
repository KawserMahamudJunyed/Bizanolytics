export type Language = 'en' | 'bn';

export const dictionaries = {
  en: {
    // Sidebar
    dashboard: "Dashboard",
    forecasts: "Forecasts",
    analytics: "Analytics",
    data_sources: "Data Sources",
    data_pipeline: "Data Pipeline",
    integrations: "Integrations",
    real_time: "Real-time",
    settings: "Settings",
    notifications: "Notifications",
    help: "Help",
    log_out: "Log Out",
    language: "Language",
    
    // Topbar
    search: "Search...",
    command_menu: "Command Menu",

    // Dashboard
    good_morning: "Good morning!",
    good_afternoon: "Good afternoon!",
    good_evening: "Good evening!",
    dashboard_subtitle: "Ready to analyze. Here's your forecast overview.",
    total_revenue: "Total Revenue",
    total_units: "Total Units Sold",
    avg_price: "Average Unit Price",
    top_product: "Top Product",
    active_products: "Active Products",
    forecast_accuracy: "Forecast Accuracy",
    
    // Data Pipeline
    upload_data: "Upload Data",
    active_dataset: "Active Dataset",
    no_data_title: "No Data Available",
    no_data_desc: "Upload a CSV file or connect an integration to view insights.",
    upload_csv: "Upload CSV",
    connect_integration: "Connect Integration",
    connect_data_source: "Connect Data Source",
    upload_instructions: "Upload your raw sales data (CSV or Excel) to let our AI process and forecast demand.",
    required_columns: "Required Columns: Date, Product_Name, Category, Location, Sales_Channel, Units_Sold, Revenue_BDT, Cost_Price, Current_Stock",
    browse_files: "Browse Files",
    download_sample: "Download Sample Dataset",
    
    // Settings & Profile
    your_profile: "Your Profile",
    manage_profile: "Manage your personal and company details.",
    full_name: "Full Name",
    company_name: "Company Name",
    save_profile: "Save Profile",

    // Analysis
    generate_forecast: "Generate Forecast",
    generating: "Generating...",
    ai_insights: "AI Insights",
    no_insights: "No insights generated yet. Click Generate Forecast to analyze your data.",
    
    // Upload Component
    drag_drop: "Drag & Drop your CSV file here",
    click_upload: "or click to browse",
    supported_files: "Supported files: .csv",
    
    // Toasts
    profile_saved: "Profile saved successfully!",
    error_saving: "Error saving profile",
    profile_saved_db_failed: "Profile saved, but database sync failed",
    go_to_account_settings: "Go to Account Settings",
    
    // Charts
    trend_analysis: "Trend Analysis",
    trend_desc: "8-week performance with moving average",
    model_performance: "Model performance metrics",
    profit_pareto: "Profit Pareto Analysis",
    profit_pareto_desc: "80/20 Rule based on product profitability",
    demand_forecast: "Demand Forecast",
    demand_forecast_desc: "Projected demand vs. inventory capacity",
    actual_demand: "Actual Demand",
    forecast: "Forecast",
    upload_data_forecast: "Upload data to see forecast",
    
    // Table
    regional_analysis: "Regional Analysis",
    regional_desc: "Detailed district-level breakdown",
    export_report: "Export Report",
    division: "Division",
    forecasted_demand: "Forecasted Demand",
    current_stock: "Current Stock",
    est_growth: "Est. Growth",
    confidence: "Confidence",
    status: "Status",
    low_stock: "Low Stock",
    critical: "Critical",
    optimal: "Optimal",
    
    // Auth
    welcome_back: "Welcome back",
    login_desc: "Enter your credentials to access your dashboard",
    email: "Email",
    password: "Password",
    log_in: "Log in",
    no_account: "Don't have an account?",
    sign_up: "Sign up",
    guest_mode: "Continue without logging in (Guest Mode)",
    create_account: "Create an account",
    signup_desc: "Enter your details to get started with Bizanolytics",
    company_name: "Company Name",
    full_name: "Full Name",
    already_account: "Already have an account?",
    
    // Integrations
    integrations_hub: "Integrations Hub",
    integrations_description: "Connect your favorite platforms, sync your databases, or log manual sales using BizPOS. Choose a category to get started.",
    sync_data_realtime: "Connect your platforms to auto-sync sales and inventory data in real-time.",
    active_connection: "Active Connection",
    disconnect: "Disconnect",
    go_to_dashboard: "Go to Dashboard",
    custom_webhook: "Custom Webhook API",
    push_data_api: "Push data directly to Bizanolytics",
    
    // Pipeline
    sync_frequency: "Sync Frequency",
    data_throughput: "Data Throughput",
    api_latency: "API Latency",
    pipeline_latency: "Pipeline Latency",
    success_rate: "Success Rate",
    recent_pipeline_runs: "Recent Pipeline Runs",
    run_id: "Run ID",
    source: "Source",
    duration: "Duration",
    records: "Records",
    time: "Time",
    upload_data_view_pipeline: "Upload data or Connect an Integration to view pipeline runs."
  },
  bn: {
    // Sidebar
    dashboard: "ড্যাশবোর্ড",
    forecasts: "পূর্বাভাস",
    analytics: "অ্যানালিটিক্স",
    data_sources: "ডেটা সোর্স",
    data_pipeline: "ডেটা পাইপলাইন",
    integrations: "ইন্টিগ্রেশনস",
    real_time: "রিয়েল-টাইম",
    settings: "সেটিংস",
    notifications: "বিজ্ঞপ্তি",
    help: "সাহায্য",
    log_out: "লগ আউট",
    language: "ভাষা",
    
    // Topbar
    search: "অনুসন্ধান...",
    command_menu: "কমান্ড মেনু",

    // Dashboard
    good_morning: "শুভ সকাল!",
    good_afternoon: "শুভ অপরাহ্ন!",
    good_evening: "শুভ সন্ধ্যা!",
    dashboard_subtitle: "বিশ্লেষণের জন্য প্রস্তুত। এখানে আপনার পূর্বাভাসের ওভারভিউ।",
    total_revenue: "মোট আয়",
    total_units: "মোট ইউনিট বিক্রি",
    avg_price: "গড় ইউনিটের দাম",
    top_product: "শীর্ষ পণ্য",
    active_products: "সক্রিয় পণ্য",
    forecast_accuracy: "পূর্বাভাস নির্ভুলতা",
    
    // Data Pipeline
    upload_data: "ডেটা আপলোড করুন",
    active_dataset: "সক্রিয় ডেটাসেট",
    no_data_title: "কোন ডেটা উপলব্ধ নেই",
    no_data_desc: "অন্তর্দৃষ্টি দেখতে একটি CSV ফাইল আপলোড করুন অথবা ইন্টিগ্রেশন সংযুক্ত করুন।",
    upload_csv: "CSV আপলোড করুন",
    connect_integration: "ইন্টিগ্রেশন সংযুক্ত করুন",
    connect_data_source: "ডেটা সোর্স সংযোগ করুন",
    upload_instructions: "আমাদের এআই প্রসেস এবং চাহিদা পূর্বাভাস করতে আপনার কাঁচা বিক্রয় ডেটা (CSV বা Excel) আপলোড করুন।",
    required_columns: "প্রয়োজনীয় কলাম: Date, Product_Name, Category, Location, Sales_Channel, Units_Sold, Revenue_BDT, Cost_Price, Current_Stock",
    browse_files: "ফাইল ব্রাউজ করুন",
    download_sample: "নমুনা ডেটাসেট ডাউনলোড করুন",
    
    // Settings & Profile
    your_profile: "আপনার প্রোফাইল",
    manage_profile: "আপনার ব্যক্তিগত এবং কোম্পানির বিবরণ পরিচালনা করুন।",
    full_name: "পুরো নাম",
    company_name: "কোম্পানির নাম",
    save_profile: "প্রোফাইল সংরক্ষণ করুন",

    // Analysis
    generate_forecast: "পূর্বাভাস তৈরি করুন",
    generating: "তৈরি হচ্ছে...",
    ai_insights: "এআই অন্তর্দৃষ্টি",
    no_insights: "এখনও কোন অন্তর্দৃষ্টি তৈরি করা হয়নি। আপনার ডেটা বিশ্লেষণ করতে পূর্বাভাস তৈরি করুন ক্লিক করুন।",
    
    // Upload Component
    drag_drop: "আপনার CSV ফাইল এখানে ড্র্যাগ এবং ড্রপ করুন",
    click_upload: "অথবা ব্রাউজ করতে ক্লিক করুন",
    supported_files: "সমর্থিত ফাইল: .csv",

    // Toasts
    profile_saved: "প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!",
    error_saving: "প্রোফাইল সংরক্ষণ করতে ত্রুটি",
    profile_saved_db_failed: "প্রোফাইল সংরক্ষিত হয়েছে, কিন্তু ডাটাবেস সিঙ্ক ব্যর্থ হয়েছে",
    go_to_account_settings: "অ্যাকাউন্ট সেটিংসে যান",
    
    // Charts
    trend_analysis: "প্রবণতা বিশ্লেষণ",
    trend_desc: "মুভিং এভারেজ সহ ৮-সপ্তাহের পারফরম্যান্স",
    model_performance: "মডেল পারফরম্যান্স মেট্রিক্স",
    profit_pareto: "মুনাফা প্যারেটো বিশ্লেষণ",
    profit_pareto_desc: "পণ্যের লাভের উপর ভিত্তি করে ৮০/২০ নিয়ম",
    demand_forecast: "চাহিদা পূর্বাভাস",
    demand_forecast_desc: "প্রত্যাশিত চাহিদা বনাম ইনভেন্টরি ক্ষমতা",
    actual_demand: "প্রকৃত চাহিদা",
    forecast: "পূর্বাভাস",
    upload_data_forecast: "পূর্বাভাস দেখতে ডেটা আপলোড করুন",

    // Table
    regional_analysis: "আঞ্চলিক বিশ্লেষণ",
    regional_desc: "বিস্তারিত জেলা-স্তরের বিভাজন",
    export_report: "রিপোর্ট এক্সপোর্ট করুন",
    division: "বিভাগ",
    forecasted_demand: "পূর্বাভাসিত চাহিদা",
    current_stock: "বর্তমান স্টক",
    est_growth: "আনুমানিক প্রবৃদ্ধি",
    confidence: "আস্থা",
    status: "অবস্থা",
    low_stock: "কম স্টক",
    critical: "সঙ্কটপূর্ণ",
    optimal: "সর্বোত্তম",

    // Auth
    welcome_back: "স্বাগতম",
    login_desc: "আপনার ড্যাশবোর্ডে প্রবেশ করতে আপনার ক্রেডেনশিয়াল দিন",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    log_in: "লগ ইন",
    no_account: "অ্যাকাউন্ট নেই?",
    sign_up: "সাইন আপ",
    guest_mode: "লগ ইন না করে চালিয়ে যান (গেস্ট মোড)",
    create_account: "একটি অ্যাকাউন্ট তৈরি করুন",
    signup_desc: "বিজানালিটিক্স শুরু করতে আপনার বিবরণ লিখুন",
    company_name: "কোম্পানির নাম",
    full_name: "পুরো নাম",
    already_account: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    
    // Integrations
    integrations_hub: "ইন্টিগ্রেশন হাব",
    integrations_description: "আপনার প্রিয় প্ল্যাটফর্মগুলি সংযুক্ত করুন, আপনার ডাটাবেস সিঙ্ক করুন, বা বিজপিওএস ব্যবহার করে ম্যানুয়ালি বিক্রয় লগ করুন। শুরু করতে একটি বিভাগ চয়ন করুন।",
    sync_data_realtime: "রিয়েল-টাইমে বিক্রয় এবং ইনভেন্টরি ডেটা স্বয়ংক্রিয়ভাবে সিঙ্ক করতে আপনার প্ল্যাটফর্মগুলিকে সংযুক্ত করুন।",
    active_connection: "সক্রিয় সংযোগ",
    disconnect: "সংযোগ বিচ্ছিন্ন করুন",
    go_to_dashboard: "ড্যাশবোর্ডে যান",
    custom_webhook: "কাস্টম ওয়েবহুক এপিআই",
    push_data_api: "বিজানালিটিক্সে সরাসরি ডেটা পুশ করুন",
    
    // Pipeline
    sync_frequency: "সিঙ্ক ফ্রিকোয়েন্সি",
    data_throughput: "ডেটা থ্রুপুট",
    api_latency: "এপিআই লেটেন্সি",
    pipeline_latency: "পাইপলাইন লেটেন্সি",
    success_rate: "সাফল্যের হার",
    recent_pipeline_runs: "সাম্প্রতিক পাইপলাইন রান",
    run_id: "রান আইডি",
    source: "উৎস",
    duration: "সময়কাল",
    records: "রেকর্ডস",
    time: "সময়",
    upload_data_view_pipeline: "পাইপলাইন রান দেখতে ডেটা আপলোড করুন বা একটি ইন্টিগ্রেশন সংযুক্ত করুন।"
  }
};

export function getTranslation(lang: Language, key: keyof typeof dictionaries['en']): string {
  return dictionaries[lang][key] || dictionaries['en'][key] || key;
}
