import { graphql } from "~/graphql";

export const settingsQuery = graphql(`
  query settings {
    settings {
      notificationsFromExperts
      peopleRatingEnabled
    }
  }
`);
export const setSettingsMutation = graphql(`
  mutation setSettings($data: SettingsValuesInput!) {
    setSettings(data: $data) {
      notificationsFromExperts
      peopleRatingEnabled
    }
  }
`);
