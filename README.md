# SAP BTP Custom Extension: Order-to-Cash (O2C) Management Portal
**Author:** Sankalp Kumar  
**Roll Number:** 23053359  
**Module:** SAP Sales and Distribution (SD) / SAP BTP Developer  

## Project Overview
This project is a custom "Pro-Code" web application designed to act as an extension on the SAP Business Technology Platform (BTP). It provides a Fiori-compliant dashboard to track and manage the Order-to-Cash (O2C) lifecycle (Inquiry -> Quotation -> Sales Order -> Delivery -> Billing). 

## Tech Stack
- **Frontend Core:** React 18 (Vite)
- **UI/UX Design:** Tailwind CSS configured strictly to SAP Fiori 3.0 (Quartz Light) guidelines.
- **Icons:** Lucide-React (Simulating SAP UI5 Iconography)
- **State Management:** React Hooks simulating an SAP S/4HANA OData V4 service backend.

## How to Run the Project Locally (VS Code)
Because this is a standalone frontend extension, it can be run directly in Visual Studio Code without an active SAP BTP instance.
1. Extract the project ZIP file and open the folder in **Visual Studio Code**.
2. Open the terminal (`Ctrl + ~`).
3. Install the required Node.js dependencies by running:
   `npm install`
4. Start the local development server by running:
   `npm run dev`
5. Click the `http://localhost:5173` link in the terminal to view the SAP Fiori dashboard in your browser.

## How to Run in SAP Business Application Studio (BAS)
1. Import the repository into your SAP BAS workspace.
2. Run `npm install`.
3. Configure the `mta.yaml` file for Cloud Foundry deployment.
4. Run `npm run build` and deploy the HTML5 module to your BTP subaccount.
