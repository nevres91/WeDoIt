// src/i18n/config.ts

// Core i18next library.
import i18n from "i18next";
// Bindings for React: allow components to
// re-render when language changes.
import { initReactI18next } from "react-i18next";
import { UserData } from "../types";

export const loadUserLanguage = (userData: UserData) => {
  if (userData) {
    const language = userData.language || "bs"; // Fallback to 'bs'
    console.log("Changing language to:", language); // Debug log
    i18n.changeLanguage(language); // Dynamically set the language
  }
};

i18n
  // Add React bindings as a plugin.
  .use(initReactI18next)
  // Initialize the i18next instance.
  .init({
    // Config options

    // Specifies the default language (locale) used
    // when a user visits our site for the first time.
    // We use English here, but feel free to use
    // whichever locale you want.
    lng: "en",

    // Fallback locale used when a translation is
    // missing in the active locale. Again, use your
    // preferred locale here.
    fallbackLng: "en",

    // Enables useful output in the browser’s
    // dev console.
    debug: true,

    // Normally, we want `escapeValue: true` as it
    // ensures that i18next escapes any code in
    // translation messages, safeguarding against
    // XSS (cross-site scripting) attacks. However,
    // React does this escaping itself, so we turn
    // it off in i18next.
    interpolation: {
      escapeValue: false,
    },

    // Translation messages. Add any languages
    // you want here.
    resources: {
      // English
      en: {
        translation: {
          // Existing translations
          hello_world: "Hello, World!",
          password: "Password",
          Already_have_an_account: "Already have an account?",
          Dont_have_an_account_yet: "Don't have an account yet?",
          login: "Login",
          register: "Register",

          // LogIn component
          email: "Email",
          log_in: "Log In",
          invalid_email: "Invalid email",
          required: "Required",
          invalid_email_or_password: "Invalid E-mail or Password.",
          logging_in: "Logging in...",

          // SignUp component
          first_name: "First Name",
          last_name: "Last Name",
          role: "Role",
          confirm_password: "Confirm Password",
          language: "Language",
          sign_up: "Sign Up",
          husband: "Husband",
          wife: "Wife",
          english: "English",
          bosanski: "Bosanski",
          invalid_email_address: "Invalid email address",
          password_min_length: "Password must be at least 6 characters",
          passwords_must_match: "Passwords must match",
          email_already_in_use: "Email already in use.",
          signing_up: "Signing Up...",

          //DashboardLeft component
          leave_your_partner: "Leave your partner",
          logout: "Logout",

          //UserProfile component
          your_information: "Your Information",
          first_name_label: "First Name:",
          last_name_label: "Last Name:",
          sex: "Sex:",
          age: "Age:",
          job: "Job:",
          height: "Height:",
          weight: "Weight:",
          female: "Female",
          male: "Male",
          unknown: "Unknown",
          task_overview: "Task Overview",
          completed: "Completed:",
          ongoing: "Ongoing:",
          expired: "EXPIRED",

          //SidebarMenu component
          your_tasks: "Your Tasks",
          link_a_partner: "Link a partner",
          partners_tasks: "Partner's Tasks",
          declined_tasks: "Declined Tasks",
          to_do: "To Do",
          calendar: "Calendar",
          notifications: "Notifications",

          //DashboardHome component
          your_task_board: "Your Task Board",
          create_new_task: "Create New Task",
          task_title: "Task Title",
          task_description: "Task Description",
          for_myself: "For Myself",
          for_partner: "For Partner",
          priority: "Priority",
          low: "Low",
          medium: "Medium",
          high: "High",
          create: "Create",
          cancel: "Cancel",
          in_progress: "In Progress",
          done: "Done",

          partners_task_board: "Partner's Task Board",

          //TaskDetails
          description: "Description:",
          creator: "Creator:",
          created: "Created:",
          due: "Due:",
          status: "Status:",
          reason: "Reason:",
          start: "Start",
          finish: "Finish",
          restart: "Restart",
          decline: "Decline",
          edit: "Edit",
          delete: "Delete",
          save: "Save",
          close: "Close",
          reactivate_task: "Reactivate Task",
          yes: "Yes",
          no: "No",
          confirm: "Confirm",
          decline_confirm_message:
            "The task will be moved to your partner's Declined Tasks section, and you won't be able to see it anymore. Do you want to proceed?",
          delete_confirm_message:
            "Are you sure that you want to delete selected task?",
          restart_confirm_message:
            "Please enter a new due date to restart the task:",
          reason_for_declining: "Reason for declining...",
          partner: "Partner",
          self: "Self",
          declined: "DECLINED",
          failed_to_decline_task: "Failed to decline task",
          failed_to_save_edits: "Failed to save edits: ",
          failed_to_update_status: "Failed to update status: ",
          please_select_due_date: "Please select a due date",

          //Declined tasks
          loading: "Loading...",
          tasks_that_partner_declined: "Tasks that your partner declined",

          // TaskCard
          accept: "Accept",
          reject: "Reject",
          from_you: "By You",
          from_husband: "From Husband",
          from_wife: "From Wife",
          edited: "Edited",
          days: "days",
          hrs: "hrs",

          leaving_partner_warning:
            "Please be advised: Leaving your partner will result in the permanent deletion of all tasks assigned by your partner, as well as those assigned to them by you. This action cannot be undone. Do you wish to proceed?",
          find_your_partner: "Find Your Partner",
          enter_partners_email: "Enter partner's email",
          link_partner: "Link Partner",
          partner_invitation_success: "Partner invitation was sent.",
          invitation_already_sent:
            "You have already sent an invitation to this user.",
          only_oposite_role: "You can only link with the opposite role.",

          task_pending_approval_message:
            "Partner must aproove your task completion.",
          pending_approvals: "Approve",
          failed_to_send_notification:
            "Failed to send a notification to your partner.",
          approve: "Approve",
          no_notifications: "You don't have any notifications.",
          task_notification:
            "task is finished, please approve it in your partner's taskboard.",
          new: "NEW",
          delete_notification: "Delete Notification?",
          not_authenticated: "You must be signed in to upload a picture.",
          upload_error: "Failed to upload profile picture. Please try again.",
          image_too_large:
            "Image is too large (max 750 KB). Try a smaller image.",
          error_leaving_partner: "Failed to leave partner. Please try again.",
          invitation_rejected_message_female:
            "{{name}} has rejected your invitation.",
          invitation_rejected_message_male:
            "{{name}} has rejected your invitation.",
          invitation: "Invitation",
          password_requirements:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          verify_email_title: "Verify Your Email",
          verify_email_message:
            "Please check your email and click the verification link to continue.",
          resend_verification_email: "Resend Verification Email",
          check_verification: "Check Verification Status",
          check_spam_folder:
            "Didn't receive the email? Check your spam or junk folder.",
          email_not_verified:
            "Your email is not yet verified. Please check your inbox.",
          sending: "Sending...",
          checking: "Checking...",
          resend_email_error:
            "Failed to resend verification email. Please try again.",
          verification_email_resent: "Verification email resent successfully!",

          // INITIAL TAsk
          initial_task_1_title: "Welcome to weDoIt!",
          initial_task_2_title: "Link to your partner!",
          initial_task_1_description:
            'Familiarize yourself with the "Task Board" and add tasks for yourself or your partner by selecting "Add New Task". The bottom of each task card displays the task\'s priority (e.g., low), the creator (you or your partner), the completion time frame (e.g., 6 days), and whether the task has been edited (Edited).',
          initial_task_2_description:
            'By selecting the "Link Partner" option in the left sidebar, you can connect with your spouse by entering their email address and awaiting their acceptance of the invitation. Upon successful linking, additional options will become available in the sidebar menu.',
          task_deleted_notification_female:
            "{{deleterName}} has deleted a task {{title}}.",
          task_deleted_notification_male:
            "{{deleterName}} has deleted a task {{title}}.",

          set_due_date: "Time limit",
          no_due_date: "No Time Limit.",
          partners_profile: "Partner's Profile",
          joined: "Joined",
          active_tasks: "Active Tasks",
          pending_approval: "Pending Approval",
          completed_tasks: "Completed Tasks",
          informations: "Personal Information",
          recent_tasks: "Recent Tasks",

          //EDIT PROFILE
          edit_profile: "Edit Profile",
          sex_change: "Sex change not allowed if linked with a partner.",
          birthday: "Birthday",
        },
      },
      // Bosnian
      bs: {
        translation: {
          // Existing translations
          hello_world: "Zdravo Svijete!",
          password: "Lozinka",
          Already_have_an_account: "Imate već kreiran račun?",
          Dont_have_an_account_yet: "Još uvijek nemate račun?",
          login: "Prijava",
          register: "Registracija",

          // LogIn component
          email: "Email",
          log_in: "Prijavi se",
          invalid_email: "Nevažeći email",
          required: "Obavezno",
          invalid_email_or_password: "Email ili lozinka nisu validni.",
          logging_in: "Prijavljivanje...",

          // SignUp component
          first_name: "Ime",
          last_name: "Prezime",
          role: "Uloga",
          confirm_password: "Potvrdi lozinku",
          language: "Jezik",
          sign_up: "Registruj se",
          husband: "Muž",
          wife: "Žena",
          english: "Engleski",
          bosanski: "Bosanski",
          invalid_email_address: "Nevažeća email adresa",
          password_min_length: "Lozinka mora imati najmanje 6 karaktera",
          passwords_must_match: "Lozinke se moraju podudarati",
          email_already_in_use: "Email se već koristi.",
          signing_up: "Registracija...",

          //DashboardLeft component
          leave_your_partner: "Napusti partnera.",
          logout: "Odjava",

          //UserProfile component
          your_information: "Vaše informacije",
          first_name_label: "Ime:",
          last_name_label: "Prezime:",
          sex: "Spol:",
          age: "Godine:",
          job: "Posao:",
          height: "Visina:",
          weight: "Težina:",
          female: "Žensko",
          male: "Muško",
          unknown: "Nepoznato",
          task_overview: "Pregled zadataka",
          completed: "Završeni:",
          ongoing: "U toku:",
          expired: "ISTEKLO",

          //SidebarMenu component
          your_tasks: "Tvoji Zadatci",
          link_a_partner: "Poveži se sa partnerom",
          partners_tasks: "Partnerovi zadatci",
          declined_tasks: "Odbijeni zadatci",
          to_do: "Uraditi",
          calendar: "Kalendar",
          notifications: "Notifikacije",

          //DashboardHome component
          your_task_board: "Tvoja Tabla Zadataka",
          create_new_task: "Kreiraj Novi Zadatak",
          task_title: "Naziv Zadatka",
          task_description: "Opis Zadatka",
          for_myself: "Za Sebe",
          for_partner: "Za Partnera",
          priority: "Prioritet",
          low: "Nizak",
          medium: "Srednji",
          high: "Visok",
          create: "Kreiraj",
          cancel: "Odustani",
          in_progress: "U Toku",
          done: "Završeni",

          partners_task_board: "Partnerova Tabla Zadataka",

          //TaskDetails
          description: "Opis:",
          creator: "Kreirao:",
          created: "Kreirano:",
          due: "Rok:",
          status: "Status:",
          reason: "Razlog:",
          start: "Započni",
          finish: "Završi",
          restart: "Restartuj",
          decline: "Odbij",
          edit: "Uredi",
          delete: "Izbriši",
          save: "Spremi",
          close: "Zatvori",
          reactivate_task: "Ponovno aktiviraj zadatak",
          yes: "Da",
          no: "Ne",
          confirm: "Potvrdi",
          decline_confirm_message:
            "Zadatak će biti premješten u odjeljak  (Odbijenei zadaci) vašeg partnera i više ga nećete moći vidjeti. Želite li nastaviti?",
          delete_confirm_message:
            "Jeste li sigurni da želite izbrisati odabrani zadatak?",
          restart_confirm_message:
            "Unesite novi rok za ponovno pokretanje zadatka:",
          reason_for_declining: "Razlog za odbijanje...",
          partner: "Partner",
          self: "Ja",
          declined: "ODBIJEN",
          failed_to_decline_task: "Neuspješno odbijanje zadatka",
          failed_to_save_edits: "Neuspješno spremanje izmjena: ",
          failed_to_update_status: "Neuspješno ažuriranje statusa: ",
          please_select_due_date: "Molimo odaberite rok",

          //Delined tasks
          loading: "Učitavanje...",
          tasks_that_partner_declined: "Zadatci koje je tvoj partner odbio",

          //TaskCard
          accept: "Prihvati",
          reject: "Odbij",
          from_you: "Od Tebe",
          from_husband: "Od Muža",
          from_wife: "Od Žene",
          edited: "Uređeno",
          days: "dana",
          hrs: "sati",

          leaving_partner_warning:
            "Upozorenje: Napuštanjem vašeg partnera trajno će se izbrisati svi zadaci koje vam je partner dodijelio, kao i oni koje ste vi dodijelili njemu/njoj. Ova radnja se ne može poništiti. Želite li nastaviti?",

          find_your_partner: "Pronađi Svog Partnera",
          enter_partners_email: "Upiši partnerov email",
          link_partner: "Povežite se",
          partner_invitation_success: "Zahtjev je uspješno poslan.",
          invitation_already_sent: "Taj korisnik je već primio vaš zahtjev.",
          only_oposite_role: "Možeš se povezati samo sa suprotnim spolom.",

          task_pending_approval_message:
            "Partner mora potvrditi da ste uspješno završili zadatak",
          pending_approvals: "Potvrdi",

          failed_to_send_notification:
            "Slanje notifikacije partneru nije uspjelo.",
          approve: "Potvrdi",
          no_notifications: "Nemate novih notifikacija.",
          task_notification:
            "zadatak je završen, potrebno je da ga potvrdite u partnerovoj tabli zadataka.",
          new: "NOVO",
          delete_notification: "Izbriši Notifikaciju?",
          not_authenticated:
            "Moraš biti prijavljen da promijeniš profilnu fotografiju.",
          upload_error:
            "Neuspješno postavljanje profilne fotografije, pokušajte ponovo.",
          image_too_large:
            "Fotografija je prevelika, (max 750kb), koristite manju fotografiju.",
          error_leaving_partner: "Failed to leave partner. Please try again.",
          invitation_rejected_message_female:
            "{{name}} je odbila tvoj zahtjev.",
          invitation_rejected_message_male: "{{name}} je odbio tvoj zahtjev.",
          invitation: "Zahtjev",
          password_requirements:
            "Password mora da sadrži najmanje jedno veliko slovo, jedno malo slovo, jedan broj i jedan znak.",
          verify_email_title: "Potvrdite E-mail adresu",
          verify_email_message:
            "Molimo provjerite vaš e-mail i kliknite na link za potvrđivanje da bi nastavili.",
          resend_verification_email: "Ponovo pošalji e-mail za potvrdu",
          check_verification: "Provjeri status potvrde",
          check_spam_folder: "Niste dobili e-mail? Provjerite neželjenu poštu.",
          email_not_verified:
            "Vaš e-mail nije potvrđen, provjerite vašu poštu.",
          sending: "Slanje...",
          checking: "Provjera...",
          resend_email_error: "Neuspješno slanje, molimo pokušajte ponovo.",
          verification_email_resent: "E-mail uspješno poslan.",
          // INITIAL TAsk
          initial_task_1_title: "Dobro došli.",
          initial_task_2_title: "Poveži se sa partnerom.",
          initial_task_1_description:
            "Upoznaj svoju Tablu Zadataka i dodaj nekoliko zadataka za svog partnera ili za sebe klikom na Dodaj Novi Zadatak. U donjem dijelu kartice ovog zadatka prikazan je prioritet samog zadatka (nizak), ko je kreirao zadatak, ti ili tvoj partner (od tebe), vremenski period izvršenja zadatka (6 dana), i eventualno ako je zadatak uređen (uređeno).",
          initial_task_2_description:
            'Odabirom opcije "Poveži partnera" u lijevoj bočnoj traci, možete se povezati sa svojim supružnikom unosom njihove email adrese i čekanjem da prihvate vaš poziv. Nakon uspješnog povezivanja, dodatne opcije će postati dostupne u meniju bočne trake.',
          task_deleted_notification_female:
            "{{deleterName}} je izbrisala zadatak {{title}}.",
          task_deleted_notification_male:
            "{{deleterName}} je izbrisao zadatak {{title}}.",

          set_due_date: "Vremenski limit",
          no_due_date: "Bez ograničenja.",
          partners_profile: "Partnerov Profil",
          joined: "Registrovan",
          active_tasks: "Aktivni Zadatci",
          pending_approval: "Potrebno Potvrditi",
          completed_tasks: "Završeni Zadatci",
          informations: "Lične Informacije",
          recent_tasks: "Nedavni Zadatci",

          //EDIT PROFILE
          edit_profile: "Izmijeni Profil",
          sex_change:
            "Promjena spola nije moguća ukoliko ste poovezani sa partnerom.",
          birthday: "Rođendan",
        },
      },
    },
  });

export default i18n;
