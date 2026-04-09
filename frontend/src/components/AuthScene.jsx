import { Link } from "react-router-dom";

const AuthScene = ({
  mode,
  title,
  submitLabel,
  fields,
  formData,
  onChange,
  onSubmit,
  error,
  submitting,
}) => {
  const isLogin = mode === "login";

  return (
    <div className={`auth-shell auth-shell-${mode}`}>
      <section className="brand-panel brand-panel-rich">
        <div className="brand-lockup">
          <p className="brand-mark">protoN</p>
          <span className="brand-divider" />
          <div>
            <p className="brand-highlight">for Social</p>
            <p className="brand-tagline">Seed stories. Grow ideas. Explore trees.</p>
          </div>
        </div>

        <div className="brand-media-showcase">
          <article className="media-story tall">
            <span className="media-pill">Seed story</span>
            <h3>Structured conversations over endless scroll.</h3>
            <p>Photos, short clips, voice notes, and thoughtful reeds can all live inside one rooted thread.</p>
          </article>
          <article className="media-story">
            <span className="media-pill">Theme pulse</span>
            <div className="mini-avatars">
              <span />
              <span />
              <span />
            </div>
            <p>Discover branches by theme instead of losing context in a feed.</p>
          </article>
        </div>
      </section>

      <section className={`auth-card-stack ${isLogin ? "login-active" : "register-active"}`}>
        <div className="floating-card back-card first" />
        <div className="floating-card back-card second" />

        <form className="auth-card auth-card-animated" onSubmit={onSubmit}>
          <div className="auth-card-header">
            <p className="auth-kicker">protoN for Social</p>
            <h1>{title}</h1>
            <p>{isLogin ? "Step back into your tree." : "Plant your account and start growing."}</p>
          </div>

          <div className="auth-fields">
            {fields.map((field) => (
              <input
                key={field.name}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={onChange}
              />
            ))}
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" disabled={submitting}>
            {submitting ? "Loading..." : submitLabel}
          </button>

          <p className="auth-switch">
            {isLogin ? "New to protoN for Social?" : "Already growing with us?"}{" "}
            <Link to={isLogin ? "/register" : "/login"}>
              {isLogin ? "Create profile" : "Login now"}
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default AuthScene;
