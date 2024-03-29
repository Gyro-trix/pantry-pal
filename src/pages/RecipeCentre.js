import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JoditEditor from 'jodit-react';

function RecipeCentre() {
    const [content, setContent] = useState("")
    const editor = useRef(null)
    const config = useMemo(() =>
    ({
        uploader: { "insertImageAsBase64URI": true },
        toolbar: false,
        readonly: true,
        height: 500
    }),
        []
    );


    const handleSearch = async () => {
        let fetchedData
        const search = 'https://www.themealdb.com/api/json/v1/1/random.php'

        try {
            const response = await fetch(search, {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error('Response was not okay')
            }

            fetchedData = await response.json()
        } catch (error) {
            console.error('Error', error)
        }
        setContent(JSON.stringify(fetchedData))
    }

    return (
        <div>
            <div className="card"  >
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1} // tabIndex of textarea
                />
            </div>
            <button onClick={handleSearch}>Fetch</button>
            <button onClick={() => console.log(content)}>Test</button>
        </div>
    )
}

export default RecipeCentre