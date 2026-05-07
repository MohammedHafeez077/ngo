import { useEffect, useState } from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const loadSummary = () => {
      Promise.all([
        api.get("/campaigns"),
        api.get("/donations"),
        api.get("/volunteers")
      ]).then(([campaignsRes, donationsRes, volunteersRes]) => {
        const completed = donationsRes.data.filter((donation) => donation.status === "Completed");
        const totalDonations = completed.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);
        const beneficiaries = campaignsRes.data.reduce((sum, campaign) => sum + Number(campaign.beneficiaries || 0), 0);
        const volunteerHours = volunteersRes.data.reduce((sum, volunteer) => sum + Number(volunteer.hours || 0), 0);
        setSummary({
          campaigns: campaignsRes.data,
          donations: donationsRes.data,
          volunteers: volunteersRes.data,
          totalDonations,
          beneficiaries,
          volunteerHours
        });
      }).catch(() => {
        setSummary({ campaigns: [], donations: [], volunteers: [], totalDonations: 0, beneficiaries: 0, volunteerHours: 0 });
      });
    };

    loadSummary();

    const handleCampaignUpdate = (event) => {
      const updatedCampaign = event.detail;
      setSummary((current) => {
        if (!current) return current;
        const campaigns = current.campaigns.map((campaign) => (
          campaign._id === updatedCampaign._id ? updatedCampaign : campaign
        ));
        const beneficiaries = campaigns.reduce((sum, campaign) => sum + Number(campaign.beneficiaries || 0), 0);
        return {
          ...current,
          campaigns,
          beneficiaries
        };
      });
    };

    window.addEventListener("campaignUpdated", handleCampaignUpdate);
    return () => window.removeEventListener("campaignUpdated", handleCampaignUpdate);
  }, []);

  return (
    <DashboardLayout title={`Welcome, ${user?.name?.split(" ")[0] || "Team"}`} eyebrow="Mission control">
      {!summary ? (
        <Loader />
      ) : (
        <>
          <section className="dashboard-hero">
            <div>
              <span className="eyebrow">{user?.title || "NGO Team"}</span>
              <h2>Today is about moving support faster, cleaner and closer to the field.</h2>
              <p>Track campaigns, donor activity and volunteer capacity from one operating view.</p>
            </div>
            <div className="hero-stat">
              <strong>Rs {summary.totalDonations.toLocaleString("en-IN")}</strong>
              <span>confirmed funding</span>
            </div>
          </section>

          <div className="grid">
            <Card title="Active Campaigns" value={summary.campaigns.length} />
            <Card title="Donations" value={summary.donations.length} />
            <Card title="Beneficiaries" value={summary.beneficiaries.toLocaleString("en-IN")} />
            <Card title="Volunteer Hours" value={summary.volunteerHours} />
          </div>

          <div className="dashboard-columns">
            <section className="card">
              <h3>Campaign Health</h3>
              {summary.campaigns.map((campaign) => {
                const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));
                return (
                  <div className="metric-row" key={campaign._id}>
                    <div>
                      <strong>{campaign.title}</strong>
                      <span>{campaign.location} - {progress}% funded</span>
                    </div>
                    <div className="progress"><span style={{ width: `${progress}%` }} /></div>
                  </div>
                );
              })}
            </section>

            <section className="card">
              <h3>Recent Donor Activity</h3>
              {summary.donations.slice(0, 4).map((donation) => (
                <div className="activity-item" key={donation._id}>
                  <div>
                    <strong>{donation.donorName}</strong>
                    <span>{donation.campaign}</span>
                  </div>
                  <b>Rs {Number(donation.amount).toLocaleString("en-IN")}</b>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
