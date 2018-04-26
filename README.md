# SFDC Selenium UI Testing  POC

Use Selenium Webdriver to test the UI experience of SFDC apps.

# Getting Started

## Create a Salesforce.com (SFDC) Developer Org

1. https://developer.salesforce.com/signup
	1. Your `username` does not need to be the same as your email. 
	1. Opt for the format `firstname.lastname@testobjective.dev`
1. Check your email
1. Verify your account


## Whitelist IPs: Disable the Email Verifcation on Login

Navigate to:

```
https://<your-sfdc-instance>.lightning.force.com/one/one.app#/setup/SetupOneHome/home
```

Then in the Quick Find window type _Profiles_. It should reduce the navbar 
options to **Users > Profiles** so click on _Profiles_.

Navigate through the list view of profile until you find _System Administrator_.
Click on the named link _System Administrator_ (not the Edit link).

Scroll down to the `Login IP Ranges` _Related List_ and click **New**.

Enter the IP range that you are connecting from. Worst case scenario, enter the
range `start: 0.0.0.0 end: 255.255.255.255`.


## Get your SFDC Org ID

You will need your `username`, `password` and `orgID`.

Navigate to the following link after you login:

```
https://<your-sfdc-instance>.lightning.force.com/one/one.app#/setup/CompanyProfileInfo/home
```

And look for the field: `Salesforce.com Organization ID`. Copy the 15 character ID.

## Running Tests

Easiest way to get the browser drivers into your PATH:

```
npm install -g chromedriver geckodriver
```

If you want to keep things contained referencing only the devDependencies 
`node_modules` then it is on you to manage the `PATH`.

Otherwise install dependencies and run tests.

```
npm install
npm test
```
