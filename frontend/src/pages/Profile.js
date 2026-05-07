import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

const permissions = {
  admin: ["Manage campaigns", "Edit campaign status", "Record donations", "Coordinate volunteers", "View impact reports", "Manage team access"],
  staff: ["Manage assigned campaigns", "Record donor conversations", "Coordinate volunteer shifts", "View field reports"],
  volunteer: ["View assignments", "Update availability", "Log service hours", "Support field activities"]
};

const tabs = ["Overview", "Edit Profile", "Preferences", "Availability", "Security", "Access"];

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [user, setUser] = useState(storedUser);
  const [activeTab, setActiveTab] = useState("Overview");
  const [savedMessage, setSavedMessage] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState(storedUser?.email || "");
  const [profile, setProfile] = useState({
    name: storedUser?.name || "Mohammed Hafeez",
    email: storedUser?.email || "admin@sevafoundation.test",
    phone: "7019017552",
    city: "Banglore",
    title: storedUser?.title || "Owner & Executive Director",
    bio: "Leading Seva Foundation programs, donor relations and field operations."
  });
  const [preferences, setPreferences] = useState({
    donationAlerts: true,
    campaignUpdates: true,
    volunteerDigest: false,
    weeklyReport: true
  });
  const [availability, setAvailability] = useState({
    weekdays: true,
    weekends: true,
    evenings: false,
    remoteSupport: true,
    maxHours: 12
  });
  const rolePermissions = permissions[user?.role] || permissions.volunteer;
  const [loadingProfile, setLoadingProfile] = useState(false);

  const completion = useMemo(() => {
    const filled = Object.values(profile).filter(Boolean).length;
    return Math.round((filled / Object.keys(profile).length) * 100);
  }, [profile]);

  const updateProfile = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
    setSavedMessage("");
  };

  const subscribeToUpdates = async (event) => {
    event.preventDefault();
    setSubscriptionMessage("");

    try {
      const selectedTopics = Object.entries(preferences)
        .filter(([, value]) => value)
        .map(([key]) => key);

      const res = await api.post("/notifications/subscribe", {
        email: subscriberEmail,
        topics: selectedTopics.length ? selectedTopics : ["general"]
      });

      setSubscriptionMessage(res.data.message || "You are subscribed to email updates.");
    } catch (err) {
      setSubscriptionMessage(err.response?.data?.message || "Unable to subscribe to updates.");
    }
  };

  const togglePreference = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
    setSavedMessage("");
  };

  const toggleAvailability = (key) => {
    setAvailability({ ...availability, [key]: !availability[key] });
    setSavedMessage("");
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const updatedUser = {
      ...user,
      name: profile.name,
      email: profile.email,
      title: profile.title
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setSavedMessage("Profile settings saved locally.");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data);
        setProfile((current) => ({
          ...current,
          name: res.data.name,
          email: res.data.email,
          title: res.data.title || current.title
        }));
        setSubscriberEmail(res.data.email || "");
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        // keep the local fallback if the API is unavailable
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <DashboardLayout title="Profile" eyebrow="Account settings">
      <section className="profile-overview">
        <div className="card profile-card">
          <div className="avatar">{profile.name.charAt(0) || "H"}</div>
          <h3>{profile.name}</h3>
          <p>{profile.title}</p>
          <span className="status completed">{user?.role || "admin"}</span>
        </div>

        <div className="card profile-progress">
          <div>
            <span className="eyebrow">Profile strength</span>
            <h3>{completion}% complete</h3>
            <p>Keep contact, availability and communication preferences current for smoother coordination.</p>
          </div>
          <div className="progress"><span style={{ width: `${completion}%` }} /></div>
        </div>

        <div className="card quick-actions">
          <h3>Quick Actions</h3>
          <button type="button" className="secondary" onClick={() => setActiveTab("Edit Profile")}>Edit Profile</button>
          <button type="button" className="secondary" onClick={() => setActiveTab("Availability")}>Update Availability</button>
          <button type="button" className="secondary" onClick={() => setActiveTab("Security")}>Security Options</button>
          <button type="button" className="secondary" onClick={() => setActiveTab("Access")}>View Access</button>
        </div>
      </section>

      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab ? "active" : ""}
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {savedMessage && <div className="success">{savedMessage}</div>}

      {activeTab === "Overview" && (
        <section className="settings-panel readonly-panel">
          <div>
            <span className="eyebrow">Contact</span>
            <h3>{profile.email}</h3>
            <p>{profile.phone}</p>
          </div>
          <div>
            <span className="eyebrow">Location</span>
            <h3>{profile.city}</h3>
            <p>{profile.title}</p>
          </div>
          <div className="full-field">
            <span className="eyebrow">About</span>
            <p>{profile.bio}</p>
          </div>
          <button type="button" onClick={() => setActiveTab("Edit Profile")}>Edit Profile</button>
        </section>
      )}

      {activeTab === "Edit Profile" && (
        <form className="settings-panel" onSubmit={saveProfile}>
          <label>Name<input name="name" value={profile.name} onChange={updateProfile} /></label>
          <label>Email<input name="email" value={profile.email} onChange={updateProfile} /></label>
          <label>Phone<input name="phone" value={profile.phone} onChange={updateProfile} /></label>
          <label>City<input name="city" value={profile.city} onChange={updateProfile} /></label>
          <label>Role title<input name="title" value={profile.title} onChange={updateProfile} /></label>
          <label className="full-field">Bio<textarea name="bio" value={profile.bio} onChange={updateProfile} /></label>
          <button type="submit">Save Profile</button>
        </form>
      )}

      {activeTab === "Preferences" && (
        <section className="settings-panel">
          <OptionRow title="Donation alerts" text="Notify me when a new donation is recorded." checked={preferences.donationAlerts} onChange={() => togglePreference("donationAlerts")} />
          <OptionRow title="Campaign updates" text="Receive alerts when campaign progress or status changes." checked={preferences.campaignUpdates} onChange={() => togglePreference("campaignUpdates")} />
          <OptionRow title="Volunteer digest" text="Send a daily summary of volunteer activity." checked={preferences.volunteerDigest} onChange={() => togglePreference("volunteerDigest")} />
          <OptionRow title="Weekly report" text="Prepare a weekly impact and finance report." checked={preferences.weeklyReport} onChange={() => togglePreference("weeklyReport")} />
          <button type="button" onClick={() => setSavedMessage("Notification preferences saved locally.")}>Save Preferences</button>

          <div className="subscription-panel">
            <h3>Email updates</h3>
            <p>Get campaign progress and volunteer alerts delivered straight to your inbox.</p>
            <form className="subscribe-form" onSubmit={subscribeToUpdates}>
              <input
                name="subscriberEmail"
                value={subscriberEmail}
                placeholder="Enter your email"
                onChange={(event) => setSubscriberEmail(event.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
            {subscriptionMessage && <div className="success">{subscriptionMessage}</div>}
          </div>
        </section>
      )}

      {activeTab === "Availability" && (
        <section className="settings-panel">
          <OptionRow title="Available on weekdays" text="Can join regular program operations." checked={availability.weekdays} onChange={() => toggleAvailability("weekdays")} />
          <OptionRow title="Available on weekends" text="Can support drives and community events." checked={availability.weekends} onChange={() => toggleAvailability("weekends")} />
          <OptionRow title="Available in evenings" text="Can support after-work coordination calls." checked={availability.evenings} onChange={() => toggleAvailability("evenings")} />
          <OptionRow title="Remote support" text="Can help with calls, reporting and documentation." checked={availability.remoteSupport} onChange={() => toggleAvailability("remoteSupport")} />
          <label className="range-field">
            Max hours per week
            <input
              max="40"
              min="1"
              name="maxHours"
              type="range"
              value={availability.maxHours}
              onChange={(event) => setAvailability({ ...availability, maxHours: event.target.value })}
            />
            <strong>{availability.maxHours} hours</strong>
          </label>
          <button type="button" onClick={() => setSavedMessage("Availability settings saved locally.")}>Save Availability</button>
        </section>
      )}

      {activeTab === "Security" && (
        <section className="settings-panel">
          <div className="security-card">
            <h3>Password</h3>
            <p>For the demo app, password changes are shown as an interface option and are not persisted to the backend.</p>
            <div className="security-grid">
              <input type="password" placeholder="Current password" />
              <input type="password" placeholder="New password" />
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button type="button" onClick={() => setSavedMessage("Password change option saved for demo.")}>Update Password</button>
          </div>
          <OptionRow title="Two-step verification" text="Require a verification code for future sign-ins." checked={false} onChange={() => setSavedMessage("Two-step verification is a demo option.")} />
          <OptionRow title="Login alerts" text="Notify me when my account is used on a new device." checked onChange={() => setSavedMessage("Login alert preference saved locally.")} />
        </section>
      )}

      {activeTab === "Access" && (
        <section className="settings-panel">
          <div className="access-header">
            <div>
              <span className="eyebrow">Role access</span>
              <h3>{user?.role || "admin"}</h3>
            </div>
            <span className="status completed">Active</span>
          </div>
          <div className="permission-list">
            {rolePermissions.map((permission) => (
              <span key={permission}>{permission}</span>
            ))}
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}

function OptionRow({ title, text, checked, onChange }) {
  return (
    <label className="option-row">
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <input type="checkbox" checked={Boolean(checked)} onChange={onChange} />
    </label>
  );
}
