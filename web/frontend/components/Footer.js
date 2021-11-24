import {h, Component} from 'preact';

import fetch from '../utils/fetch';

export default class Footer extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            links: []
        };
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getFooter();
    }

    /**
     * Get all footer links from the content API
     */
    async getFooter() {
        const footer = await fetch(`${window.expressConfig.contentApi}/footer`);

        if (footer && footer.status.success) {
            this.setState({
                links: footer.data
            });
        }
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {links} = this.state;

        return (
            <div className="max-w-screen-xl p-4 mx-auto mt-4 text-gray-200 border-t border-gray-800 md:px-8">
                <div className="grid md:grid-rows-3 md:grid-cols-3 md:grid-flow-col">
                    {links.map((link, key) => (
                        <span className="py-3 md:py-0 md:pb-4" key={key}>
                            <a href={link.url}>{link.label}</a>
                        </span>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-between pt-6 pb-10 space-y-4 text-sm md:flex-row text-accent-6">
                    <div>
                        <span>© {new Date().getFullYear()} ACME, Inc. All rights reserved.</span>
                    </div>
                </div>
            </div>
        );
    }
}
