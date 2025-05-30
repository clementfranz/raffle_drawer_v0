import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("infoprint", "routes/infoprint.tsx"),

  layout("routes/Protected.tsx", [
    route("main", "routes/main.tsx"),
    route("tester", "routes/tester.tsx"),
    route("presenter", "routes/presenter.tsx")
  ]),

  ...prefix("docs", [
    layout("components/LegalDocs/WrapperLayout.tsx", [
      route(
        "software-license-agreement-v2",
        "components/LegalDocs/SoftwareLicenseAgreementV2.tsx"
      ),
      route(
        "software-license-agreement-v1",
        "components/LegalDocs/SoftwareLicenseAgreementV1.tsx"
      ),
      route("privacy-policy", "components/LegalDocs/PrivacyPolicy.tsx"),
      route("terms-and-condition", "components/LegalDocs/TermsAndCondition.tsx")
    ])
  ])
] satisfies RouteConfig;
