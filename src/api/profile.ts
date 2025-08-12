import { graphql } from "~/graphql";

export const deleteMyUserProfile = graphql(`
  mutation deleteUserProfile {
    deleteMyProfileUser
  }
`);

export const deleteMyExpertProfile = graphql(`
  mutation deleteMyExpertProfile {
    deleteMyProfileExpert
  }
`);
export const deleteMyOrganizatorProfile = graphql(`
  mutation deleteMyOrganizaotorProfile {
    deleteMyProfileOrganizator
  }
`);
