import { graphql } from "~/graphql";
export const createExpertProfileMutation = graphql(`
  mutation CreateExpertRequest($input: ProfileCreateInput!) {
    createProfileRequest(input: $input) {
      id
    }
  }
`);

export const expertProfileQuery = graphql(`
  query getExpertProfile($id: ID!) {
    user(id: $id) {
      avatar
      firstName
      lastName
      rights
      platforms {
        platformID
        platform
      }
      expertProfile {
        socialMediaLink
        peopleRatingEnabled
        referUsername
        region {
          regionName
        }
        communityDirections {
          direction
          name
        }
        votesCount
        peopleVotesCount
        countEvents
        about
        myExpertVote
        myPeopleVote
      }
    }
  }
`);

export const assignTariffMutatuion = graphql(`
  mutation assignTariff($data: AssignTariffInput!) {
    assignTariff(data: $data)
  }
`);

export const voteInPeopleRaitingMutate = graphql(`
  mutation voteInPeopleRaiting($data: CreateVoteInput!) {
    createVote(data: $data) {
      id
    }
  }
`);

export const deleteVotePeopleMutate = graphql(`
  mutation deletePeopleVote($data: DeleteVoteInput!) {
    deleteVote(id: $data)
  }
`);

export const verificateUserAdmin = graphql(`
  mutation verificateUserFromAdmin($userID: ID!) {
    verifiesUser(userID: $userID)
  }
`);

export const preExpertRequestCreateQuery = graphql(`
  mutation preExpertRequestCreate(
    $data: CreateRepresentativeExpertRequestInput!
  ) {
    createRepresentativeRequest(data: $data)
  }
`);

export const assignAdminRights = graphql(`
  mutation assignAdminRightToExpert($id: ID!) {
    assignAdminRights(userID: $id) {
      id
    }
  }
`);
