import * as React from 'react'
import { templateModel } from '../Models/TemplateModel';
import { searchByTemplateId } from '../Services/SendGridService';
import { isTemplateModel } from '../Services/UtilService';

interface Props {
    templateId: string,
    apiKey: string
}

const MainComponent = (props: Props) => {
    const [queryInProgress, setQueryInProgress] = React.useState(false);
    const [thumbnailUrl, setThumbnailUrl] = React.useState<null | string>(null);
    const [queryError, setQueryError] = React.useState(false);


    React.useEffect(() => {
        const getThumbnail = async () => {
            setQueryInProgress(true);
            const templateData = await searchByTemplateId(props.templateId, props.apiKey);
            setQueryInProgress(false);

            if (isTemplateModel(templateData) && (templateData as templateModel).thumbnailUrl) {
                const templateModel = (templateData as templateModel)
                setThumbnailUrl(templateModel.thumbnailUrl!);
            }
            else{
                setQueryError(true);
            }
        }
        getThumbnail();
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center'>
                    {queryInProgress ?
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        : null}
                    {thumbnailUrl ?
                        <img src={thumbnailUrl}></img>
                        : null}

                    {queryError ?
                        <div className="alert alert-danger" role="alert">
                            An error ocurred while getting the thumbnail of the template. Please check your browsers console for more information about the error.
                        </div>
                        : null}
                </div>
            </div>
        </div>
    )
}

export default MainComponent
