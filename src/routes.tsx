import { Route, Router, RouteSectionProps } from "@solidjs/router";
import { ErrorBoundary, JSXElement, lazy, type Component } from "solid-js";
import NotFoundPage from "./pages/NotFound";
import TariffListPage from "./pages/administration/tariffs/Index";
import EventsList from "./pages/events";
import TariffsPage from "./pages/profile/tariffs";
import PaidTariffPage from "./pages/profile/tariffs/paid";
import PromocodePage from "./pages/administration/promocodes";
import MyErrorFallback from "./components/MyErrorFallback";
import OrganizatorCreate from "./pages/profile/organizatorCreate";
import NotificationsPage from "./pages/profile/notifications";
import UsageRightsEdit from "./pages/administration/usageRightsEdit";
import MailingPage from "./pages/profile/mailing";
import CreateVerificationRequest from "./pages/profile/verification/createRequest";
import CreateRepresentativeExpertRequest from "./pages/profile/preExpert/createProfile";
import VerificationPage from "./pages/profile/verification/verificationPage";
import RepresentativeUsers from "./pages/profile/preExpert";
import useMe from "./hooks/useMe";
import PreExpertRequests from "./pages/profile/preExpert/requests";
import MailingAdminPage from "./pages/administration/mailing";
import AssignedExpertsToEventPage from "./pages/events/assignedExperts";

const EventPage = lazy(() => import("./pages/events/event"));
const Home = lazy(() => import("~/pages/Home"));
const Layout = lazy(() => import("~/containers/layout"));
const ProfileMenu = lazy(() => import("~/pages/profile/menu"));
const Usage = lazy(() => import("~/pages/Usage"));
const ExpertList = lazy(() => import("~/pages/experts/ExpertList"));
const ExpertProfile = lazy(() => import("~/pages/experts/ExpertProfile"));
const NewExpertProfile = lazy(() => import("~/pages/profile/NewExpertProfile"));
const MyProfile = lazy(() => import("~/pages/profile/MyProfile"));
const ModerationList = lazy(
  () => import("~/pages/administration/moderation/profiles"),
);
const ModerationCard = lazy(
  () => import("~/pages/administration/moderation/profiles/card"),
);
const Events = lazy(() => import("./pages/profile/events"));
const EventsPayment = lazy(() => import("./pages/profile/events/payment"));
const Settings = lazy(() => import("./pages/profile/Settings"));
const EventInput = lazy(() => import("./pages/events/input"));
const ModerationEventList = lazy(
  () => import("./pages/administration/moderation/events"),
);
const ModerationEventCard = lazy(
  () => import("~/pages/administration/moderation/events/card"),
);

const App: Component<RouteSectionProps<unknown>> = (props) => {
  return <MyErrorFallback>{props.children}</MyErrorFallback>;
};
const Routes: Component = () => {
  return (
    <Router root={App}>
      <Route component={Layout}>
        <Route path="/" component={Home} />
        <Route path="/menu">
          <Route path="/" component={ProfileMenu} />
          <Route path="/register-expert" component={NewExpertProfile} />
          <Route path="/register-organizator" component={OrganizatorCreate} />
          <Route
            path="/register-representative"
            component={OrganizatorCreate}
          />
          <Route path="/my-profile" component={MyProfile} />
          <Route path="/settings" component={Settings} />
          <Route path="/mailing" component={MailingPage} />
          <Route path="/events">
            <Route component={Events} />
            <Route path="/:id" component={EventPage} />
            <Route path="/:id/payment" component={EventsPayment} />
          </Route>
          <Route path="/tariffs">
            <Route path="/" component={TariffsPage} />
            <Route path="paid" component={PaidTariffPage} />
          </Route>
          <Route path="/notifications" component={NotificationsPage} />
          <Route path="/verification">
            <Route
              path="/create-profile"
              component={CreateVerificationRequest}
            />
            <Route path="/expert/:id" component={VerificationPage} />
          </Route>
          <Route path="/representative">
            <Route component={RepresentativeUsers} />
            <Route
              path="/create-profile"
              component={CreateRepresentativeExpertRequest}
            />
            <Route path="/requests" component={PreExpertRequests} />
          </Route>
        </Route>
        <Route path="/administration">
          <Route path="/moderation">
            <Route path="/experts">
              <Route path="/" component={ModerationList} />
              <Route path="/:id" component={ModerationCard} />
            </Route>
            <Route path="/events">
              <Route path="/" component={ModerationEventList} />
              <Route path="/:id" component={ModerationEventCard} />
            </Route>
          </Route>
          <Route path="/tariffs">
            <Route path="/" component={TariffListPage} />
          </Route>
          <Route path="/promocodes">
            <Route path="/" component={PromocodePage} />
          </Route>
          <Route path="/usage" component={UsageRightsEdit} />
          <Route path="/mailing" component={MailingAdminPage} />
        </Route>
        <Route path="/usage" component={Usage} />
        <Route path="/experts/">
          <Route component={ExpertList} />
          <Route path="/:id" component={ExpertProfile} />
        </Route>
        <Route path="/events">
          <Route path="/" component={EventsList} />
          <Route path="/input" component={EventInput} />
          <Route path="/:id" component={EventPage} />
          <Route
            path="/:id/assignedExperts"
            component={AssignedExpertsToEventPage}
          />
        </Route>
      </Route>
      <Route path="*" component={NotFoundPage} />
    </Router>
  );
};
export default Routes;
