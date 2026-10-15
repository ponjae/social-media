import { Form, Radio, Image, Icon, Label } from "semantic-ui-react";
import availableAvatars from "../utils/avatars";
import "./AvatarSelector.css";

// "…/avatar/large/molly.png" -> "Molly" (used only for screen-reader text)
const avatarName = (url) => {
  const file = url.split("/").pop().split(".")[0] || "Avatar";
  return file.charAt(0).toUpperCase() + file.slice(1);
};

/**
 * Visual radio group for picking a profile avatar.
 *
 * `onChange` receives an event-like `{ target: { name, value } }` object so it
 * works directly with the `useForm` hook.
 */
const AvatarSelector = ({
  name = "avatar",
  value = "",
  onChange,
  error,
  required = true,
  label = "Choose an avatar",
  hint = "This is how others will see you.",
  avatars = availableAvatars,
}) => {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;

  const handleChange = (_, data) => {
    onChange({ target: { name, value: data.value } });
  };

  return (
    <Form.Field
      as="fieldset"
      error={!!error}
      className="avatar-selector"
      aria-describedby={error ? `${hintId} ${errorId}` : hintId}
    >
      <legend className="avatar-selector__legend">{label}</legend>
      <p id={hintId} className="avatar-selector__hint">
        {hint}
      </p>

      <div className="avatar-selector__grid">
        {avatars.map((url, index) => {
          const checked = value === url;
          return (
            <Radio
              key={url}
              id={`${name}-option-${index}`}
              name={name}
              value={url}
              checked={checked}
              onChange={handleChange}
              required={required}
              className="avatar-selector__option"
              label={{
                children: (
                  <>
                    <Image
                      src={url}
                      alt={`${avatarName(url)} avatar`}
                      circular
                      className="avatar-selector__image"
                    />
                    <Icon
                      name="check"
                      className="avatar-selector__check"
                      aria-hidden="true"
                    />
                  </>
                ),
              }}
            />
          );
        })}
      </div>

      {error && (
        <Label
          id={errorId}
          prompt
          pointing="above"
          role="alert"
          className="avatar-selector__error"
        >
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default AvatarSelector;
