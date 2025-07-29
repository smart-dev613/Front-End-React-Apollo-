import React, { Component, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Trans } from "react-i18next";

type ProfileKeywordsProps = {
  isEditing: boolean,
  selectedLanguage: string,
  profiles: {
    locale?: string,
    bio?:  string,
    keywords?: string[]
  }[],
  handleKeywordChange?: (profilesData: any) => void
  
}

const ProfileKeywords = ({
  isEditing,
  selectedLanguage,
  profiles,
  handleKeywordChange
}: ProfileKeywordsProps) => {
  let keywords:string[] = [];
  let keyword: string = '';
  const keywordInputRef = useRef(null);
  const profileIndex:any = profiles?.findIndex(profile => profile.locale === selectedLanguage);

  if( profileIndex !== -1 ) {
    keywords = profiles?.[profileIndex]?.keywords || [];
  }

  const removeKeyword = (keyword: string) => {
    const profileIndex:any = profiles?.findIndex(profile => profile.locale === selectedLanguage);

    //@ts-ignore
    profiles = profiles?.map((profile, index) => {
      if( profile.locale === selectedLanguage ) {
        //@ts-ignore
        const newKeywords = profiles?.[profileIndex]?.keywords?.filter(word => word !== keyword) || [];
        return {
          locale: selectedLanguage,
          keywords: newKeywords,
          bio: profiles?.[index]?.bio
        }
      } else {
        return profile;
      }
    });

    //@ts-ignore
    handleKeywordChange(profiles);
  }

  const addKeyword = () => {
    //Check for empty spaces
    if( keyword.trim().length === 0 ) return;

    // New profile language - create empty object
    const profileIndex = profiles?.findIndex(profile => profile.locale === selectedLanguage);
    if( profileIndex === -1 ) {
      //new profile locale
      profiles = [
        //@ts-ignore
        ...profiles,
        {
          locale: selectedLanguage,
          bio: '',
          keywords: []
        }
      ]
    }

    //@ts-ignore
    profiles = profiles?.map((profile, index) => {
      if( profile.locale === selectedLanguage ) {
        let newKeywords = profiles?.[index]?.keywords;
        newKeywords?.push(keyword);
        return {
          locale: selectedLanguage,
          keywords: newKeywords,
          bio: profiles?.[index]?.bio
        }
      } else {
        return profile;
      }
    });

    //Reset keyword to empty string for further ussage
    //@ts-ignore
    keywordInputRef.current.value = ""

    //@ts-ignore
    handleKeywordChange(profiles);
  }

  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <label htmlFor='keywords'>
            <Trans i18nKey="Keywords">trans</Trans>:
          </label>
        </div>
      </div>       
      <div className="row mt-3">
        { 
          keywords.map((keyword, index)=> (
            !isEditing ? 
            (
              <div className="col-6 mt-3" key={`${keyword}-${index}`}>
                <input name='keyword2' value={keyword} disabled type='text' />
              </div>
            ):(
              <div className="col-6 keyword-container" key={`${keyword}-${index}-edit`}>
                <div className="edit-keyword"><div className="keyword">{keyword}</div>
                  <span onClick={()=> { removeKeyword(keyword) }}><FontAwesomeIcon icon="times"/></span>
                </div>
              </div>
            )
          ))
        }

        {
          isEditing && (
            <div className="col-12">
              <div className="row add-keyword-row">
                <div className="col-10">
                  <input 
                    type="text"
                    ref={keywordInputRef}
                    defaultValue={keyword}
                    onChange={(e)=> keyword = e.target.value} 
                    className="add-keyword"  
                    placeholder="Enter Brand Keywords Here"/></div>
                <div className="col-2"><span onClick={addKeyword}><FontAwesomeIcon icon="check"/></span></div>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}

export default ProfileKeywords