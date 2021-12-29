import { templateModel } from "../Models/TemplateModel";

export const searchByTemplateId = async (templateId: string, apiKey: string) => {
    const requestUrl = `${sendGridUrl}templates/${templateId}`
    const headers = ConstructHeaders(apiKey);

    const response = await fetch(requestUrl, { headers: headers })
        .then(response => {
            if(response.ok){
                return response.json()
            }
            else{
                if(response.status === 404){
                    console.error(`The template with the id of ${templateId} cannot be found in Sendgrid. Please make sure both the template id and api key are correct.`)
                }
                if(response.status === 403){
                    console.error('Your api key is incorrect. please regenerate a new api key and use it instead.');
                }
                else{
                    console.error(response);
                }
            }            
        })
        .then(response => {
            return convertSuccessResponseToTemplateModel(response);
        })
    
    return response;
}

const convertSuccessResponseToTemplateModel = (response: any) => {
    let template: any = {}

    template.id = response.id;
    template.name = response.name;
    template.updatedAt = response["updated_at"];

    if (response.versions && Array.isArray(response.versions)) {
        const allVersions = response.versions;
        for (const index in allVersions) {
            if (allVersions[index].active === 1) {              
                if (allVersions[index].subject) {
                    template.subject = allVersions[index].subject;
                }                

                if (allVersions[index].thumbnail_url) {
                    template.thumbnailUrl = allVersions[index].thumbnail_url;
                }                
            }
        }
    }
    return template as templateModel
}

const sendGridUrl = 'https://api.sendgrid.com/v3/'

const ConstructHeaders = (apiKey: string) => {
    return {
        "authorization": `Bearer ${apiKey}`,
        "content-type": "application/json"
    }
}
