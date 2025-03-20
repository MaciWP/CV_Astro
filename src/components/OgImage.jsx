import React from 'react';

/**
 * OgImage component for generating dynamic Open Graph images
 * This component can be rendered to an image using tools like @vercel/og
 * For now, the static image will be used, but this provides a template for future use
 */
const OgImage = ({ name = "Oriol Macias", title = "Software Developer" }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                backgroundColor: '#121620',
                backgroundImage: 'linear-gradient(to right bottom, #121620, #1e2433)',
                padding: '60px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                position: 'relative',
            }}
        >
            {/* Red accent element - top left */}
            <div
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100px',
                    height: '12px',
                    backgroundColor: '#D83333',
                }}
            />

            {/* Top header section */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: '40px',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#D83333',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                >
                    OM
                </div>

                {/* URLs */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#9ca3af',
                        fontSize: '16px',
                    }}
                >
                    oriolmacias.dev | github.com/MaciWP
                </div>
            </div>

            {/* Main content */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flexGrow: 1,
                }}
            >
                <h1
                    style={{
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0',
                        lineHeight: '1.2',
                    }}
                >
                    {name}
                </h1>

                <h2
                    style={{
                        fontSize: '36px',
                        fontWeight: 'medium',
                        color: '#D83333',
                        margin: '0',
                        marginTop: '16px',
                    }}
                >
                    {title}
                </h2>

                <p
                    style={{
                        fontSize: '24px',
                        color: '#9ca3af',
                        marginTop: '32px',
                        maxWidth: '650px',
                        lineHeight: '1.4',
                    }}
                >
                    Backend Developer specializing in industrial protocol integration with 8+ years
                    delivering high-performance applications. Expertise in Python, C#, .NET, Django,
                    and data center infrastructure.
                </p>
            </div>

            {/* Red accent element - bottom right */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '200px',
                    height: '8px',
                    backgroundColor: '#D83333',
                }}
            />
        </div>
    );
};

export default OgImage;