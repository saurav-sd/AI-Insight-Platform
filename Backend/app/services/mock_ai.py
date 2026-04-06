def get_mock_insight():
    return {
        "insights": [
            "Users are actively engaging with the dashboard"
        ],
        "trends": [
            "Login activity is increasing"
        ],
        "issues": [
            "Drop observed in checkout funnel"
        ],
        "suggestions": [
            "Improve onboarding UX",
            "Add retention notifications"
        ]
    }


def get_mock_agents():
    return {
        "data_agent": "Most activity is around login and dashboard views.",
        "growth_agent": "Introduce referral program to boost engagement.",
        "risk_agent": "Drop in checkout could indicate payment issues."
    }