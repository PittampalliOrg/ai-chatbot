

import  getGraphClient from '@/app/db'
import { Message } from '@microsoft/microsoft-graph-types';
import { removeSpacesFromFolderName } from './utils';
import { revalidatePath } from 'next/cache';

export type Folder = {
  id: string;
  name: string;
  email_count: string;
};

export async function getFoldersWithEmailCount() {
    const client = await getGraphClient();
  
    const response = await client
      .api('/me/mailFolders')
      .get();
  
    console.log(response);
  
    // convert the response to the format we need
    const folders: Folder[] = response.value.map((folder: any) => ({
      id: folder.id,
      name: folder.displayName,
      email_count: folder.totalItemCount,
    }));

  let specialFoldersOrder = ['Inbox', 'Drafts', 'Deleted Items'];
  let specialFolders = specialFoldersOrder
    .map((name) => folders.find((folder) => folder.name === name))
    .filter(Boolean) as Folder[];
  let otherFolders = folders.filter(
    (folder) => !specialFoldersOrder.includes(folder.name)
  ) as Folder[];

  return { specialFolders, otherFolders };
}

type EmailWithSender = {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  sent_date: Date;
  first_name: string;
  last_name: string;
  email: string;
};
export async function getEmailsForFolder(folderName: string = "Inbox") {
  // Authentication setup should be done outside this function and passed in if needed
  const client = await getGraphClient();

  // remove spaces in folder name
  let originalFolderName = removeSpacesFromFolderName(folderName);

  let endpoint = `/me/mailFolders/${originalFolderName}/messages`;


  try {
    const response = await client.api(endpoint).get();
    const emails: Message[] = response.value;

    revalidatePath(`/mail/${folderName}`)
    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  };
  
}


// Helper function to convert string to title case
// function toTitleCase(str: string): string {
//   return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
// }


export async function getEmailInFolder(folderName: string, emailId: string) {
  const client = await getGraphClient();

  let originalFolderName = removeSpacesFromFolderName(folderName);
  let endpoint = `/me/mailFolders/${originalFolderName}/messages/${emailId}`;

    const response = await client.api(endpoint)
    .get();
   //   .select('id,subject,body,sentDateTime,from,toRecipients')

    // Transform the Graph API response to match the EmailWithSender type
    const email: EmailWithSender = {
      id: response.id,
      sender_id: response.from.emailAddress.address, // We don't have this info from Graph API
      recipient_id: response.toRecipients[0].emailAddress.address, // We don't have this info from Graph API
      subject: response.subject,
      body: response.body.content,
      sent_date: new Date(response.sentDateTime),
      first_name: response.from.emailAddress.name.split(' ')[0],
      last_name: response.from.emailAddress.name.split(' ').slice(1).join(' '),
      email: response.from.emailAddress.address
    };

    return email;
}

type UserEmail = {
  first_name: string;
  last_name: string;
  email: string;
};

export async function getAllEmailAddresses(): Promise<UserEmail[]> {
  const client = await getGraphClient();

  try {
    const response = await client.api('/users')
      .get();

    // Transform the Graph API response to match the UserEmail type
    const userEmails: UserEmail[] = response.value.map((user: any) => ({
      first_name: user.givenName,
      last_name: user.surname,
      email: user.mail
    }));

    return userEmails;
  } catch (error) {
    console.error("Error fetching email addresses:", error);
    throw error;
  }
}


export async function getEmailById(id: string): Promise<Message | null> {
  const client = await getGraphClient()
  try {
    const response = await client
      .api(`/me/messages/${id}`)
      .select('id,subject,bodyPreview,body,receivedDateTime,isRead,sender,sentDateTime,categories')
      .get()
    return response
  } catch (error) {
    console.error("Error fetching email:", error)
    return null
  }
}

import { MailFolder } from "@microsoft/microsoft-graph-types"


export async function getEmailFolders(): Promise<MailFolder[]> {
  const client = await getGraphClient()
  const response = await client
    .api("/me/mailFolders")
    .select("id,displayName,parentFolderId,childFolderCount,unreadItemCount,totalItemCount")
    .get()

  return response.value
}