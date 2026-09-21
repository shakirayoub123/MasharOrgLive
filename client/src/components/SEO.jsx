import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = "Mashar | A Stronger Tomorrow Together",
    description = "Mashar is a global alumni network that connects people, inspires growth, and creates opportunities to make a lasting impact.",
    keywords = "Mashar, Alumni, Global Network, Leadership, Coaching",
    ogImage = "/mashar_logo.svg",
    canonicalUrl = window.location.href
}) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph (Facebook/LinkedIn etc) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content="Mashar" />

            {/* Twitter tags */}
            <meta name="twitter:creator" content="@MasharApp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
};

export default SEO;
