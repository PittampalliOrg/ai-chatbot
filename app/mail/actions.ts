'use server'


import { MailFolder } from '@microsoft/microsoft-graph-types'
import  getGraphClient from '@/app/db'
import { Mail } from '@/types'
import { removeSpacesFromFolderName } from './utils'
import { Message } from '@microsoft/microsoft-graph-types'
import { revalidatePath } from 'next/cache'

export async function getEmails(emailIds?: string[]): Promise<Mail[]> {
    const client = await getGraphClient();
  
    const response = await client
      .api('/me/messages')
      .select('id,subject,bodyPreview,receivedDateTime,isRead,from')
      .top(100)
      .get();
  
    console.log(response);
  
    let emails: Mail[] = response.value.map((message: any) => ({
      id: message.id,
      name: message.from.emailAddress.name,
      email: message.from.emailAddress.address,
      subject: message.subject,
      text: message.bodyPreview,
      date: message.receivedDateTime,
      read: message.isRead,
      labels: [], // Labels would need additional logic or a different API call to retrieve
    }));
  
    if (emailIds && emailIds.length > 0) {
      emails = emails.filter(email => emailIds.includes(email.id));
    }
  
    return emails;
  }
  
  
  // function to get email folders
  export async function getEmailFolders(): Promise<MailFolder[]> {
    const client = await getGraphClient();
  
    const response = await client
      .api('/me/mailFolders')
      .get();
  
    console.log(response);
  
    return response.value;
  }
  
  export async function getMessagesForFolder(folderName: string = "Inbox"): Promise<Mail[]>  {
    const client = await getGraphClient();
    const response = await client.api(`/me/mailFolders/${removeSpacesFromFolderName(folderName)}/messages`)
      .select('subject,from,receivedDateTime,bodyPreview')
      .top(50)
      .get();
    
      let emails: Mail[] = response.value.map((message: any) => ({
        id: message.id,
        name: message.from.emailAddress.name,
        email: message.from.emailAddress.address,
        subject: message.subject,
        text: message.bodyPreview,
        date: message.receivedDateTime,
        read: message.isRead,
        labels: [], // Labels would need additional logic or a different API call to retrieve
      }));
    
      return emails;
  }

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