const x = [
  {
    name: "emit",
    name_localizations: undefined,
    description: "Emit an event.",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 1,
        name: "event",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Select a client event to emit.",
        description_localizations: undefined,
        description_localized: undefined,
        required: undefined,
        autocomplete: undefined,
        choices: undefined,
        options: [Array],
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 1,
        name: "button",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Emit a button.",
        description_localizations: undefined,
        description_localized: undefined,
        required: undefined,
        autocomplete: undefined,
        choices: undefined,
        options: [Array],
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "reload",
    name_localizations: undefined,
    description: "Reloads a component of the client",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 1,
        name: "commands",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Reloads the client commands.",
        description_localizations: undefined,
        description_localized: undefined,
        required: undefined,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 1,
        name: "events",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Reloads the client events.",
        description_localizations: undefined,
        description_localized: undefined,
        required: undefined,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 1,
        name: "buttons",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Reload the client buttons.",
        description_localizations: undefined,
        description_localized: undefined,
        required: undefined,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "spam",
    name_localizations: undefined,
    description: "Spam's a message inside a channel.",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 3,
        name: "content",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Input the content of the message(s).",
        description_localizations: undefined,
        description_localized: undefined,
        required: true,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 10,
        name: "amount",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Select the amount of messages to be sent.",
        description_localizations: undefined,
        description_localized: undefined,
        required: true,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "ban",
    name_localizations: undefined,
    description: "Bans a guild member.",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 9,
        name: "target",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Select a member.",
        description_localizations: undefined,
        description_localized: undefined,
        required: true,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 3,
        name: "reason",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Input a reason.",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 5,
        name: "messages",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Delete the target's messages?",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "clean",
    name_localizations: undefined,
    description:
      "Removes a certain amount of messages from the specified channel.",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 3,
        name: "amount",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Input the amount of messages.",
        description_localizations: undefined,
        description_localized: undefined,
        required: true,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 9,
        name: "target",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Select a specific users messages to delete.",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 3,
        name: "filter",
        name_localizations: undefined,
        name_localized: undefined,
        description:
          "Filter for a specific word/phrase in the messages to be cleaned.",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 3,
        name: "reason",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Input a reason.",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "kick",
    name_localizations: undefined,
    description: "Removes a member from the server.",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 9,
        name: "target",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Select a target.",
        description_localizations: undefined,
        description_localized: undefined,
        required: true,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 3,
        name: "reason",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Input a reason.",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "timeout",
    name_localizations: undefined,
    description:
      "Temporarily disables a member's ability to interact with the guild. ",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 9,
        name: "target",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Select the target.",
        description_localizations: undefined,
        description_localized: undefined,
        required: true,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 3,
        name: "duration",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Input a duration.",
        description_localizations: undefined,
        description_localized: undefined,
        required: true,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: 3,
        name: "reason",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Input a reason.",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: undefined,
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "help",
    name_localizations: undefined,
    description: "Gets information about every command.",
    description_localizations: undefined,
    type: undefined,
    options: undefined,
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "ping",
    name_localizations: undefined,
    description: "Checks the client's uptime.",
    description_localizations: undefined,
    type: undefined,
    options: undefined,
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
  {
    name: "role",
    name_localizations: undefined,
    description: "Manages a role.",
    description_localizations: undefined,
    type: undefined,
    options: [
      {
        type: 1,
        name: "grant",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Adds/Removes the selected role from the target.",
        description_localizations: undefined,
        description_localized: undefined,
        required: undefined,
        autocomplete: undefined,
        choices: undefined,
        options: [Array],
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
      {
        type: undefined,
        name: "fetch",
        name_localizations: undefined,
        name_localized: undefined,
        description: "Fetches the information of a role.",
        description_localizations: undefined,
        description_localized: undefined,
        required: false,
        autocomplete: undefined,
        choices: undefined,
        options: [Array],
        channel_types: undefined,
        min_value: undefined,
        max_value: undefined,
        min_length: undefined,
        max_length: undefined,
      },
    ],
    default_member_permissions: undefined,
    dm_permission: undefined,
  },
];
console.log(x[9].options[1]);