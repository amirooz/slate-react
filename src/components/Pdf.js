import React, { Component } from 'react'
import {PDFtoIMG} from 'react-pdf-to-image';
import file from './listing-playbook.pdf';

export class Pdf extends Component {
    render() {
        return (
            <div className="container">
                <div className="dashboard">
                    <PDFtoIMG file={file}>
                        {({pages}) => {
                            if (!pages.length) return 'Loading...';
                            return pages.map((page, index, i)=> 
                                <img key={index} src={page} alt={page} />
                            );
                        }}
                    </PDFtoIMG>
                </div>
            </div>
        )
    }
}

export default Pdf
